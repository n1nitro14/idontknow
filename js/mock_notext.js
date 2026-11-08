/**
 * NisitKU NOTEXT Mock Layer
 * Completely intercepts all network requests and returns NOTEXT placeholder data.
 * All dynamic UI sections display "NOTEXT" while preserving 100% original layout.
 */

(function () {
    // 0. Resolve card slug: ?card= takes priority, then saved localStorage card_slug
    function getQueryParam(name) {
        var params = new URLSearchParams(window.location.search);
        var val = params.get(name);
        if (!val && window.location.hash.indexOf("?") !== -1) {
            params = new URLSearchParams(window.location.hash.split("?")[1]);
            val = params.get(name);
        }
        return val;
    }

    var cardParam = getQueryParam("card") || localStorage.getItem("card_slug") || null;
    // Persist slug if provided via URL
    if (getQueryParam("card")) {
        localStorage.setItem("card_slug", getQueryParam("card"));
    }

    var activeCardData = null;

    if (cardParam) {
        // Look for <card>.json in cards/, img/, or root
        var jsonCandidates = [
            "cards/" + cardParam + ".json",
            "img/" + cardParam + ".json",
            cardParam + ".json"
        ];
        for (var i = 0; i < jsonCandidates.length; i++) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", jsonCandidates[i], false); // Synchronous fetch for instant load
                xhr.send();
                if (xhr.status === 200 || xhr.status === 0) {
                    activeCardData = JSON.parse(xhr.responseText);
                    break;
                }
            } catch (e) {}
        }
    }

    // 1. Initialize LocalStorage
    var defaultId = "NOTEXT";
    var defaultToken = "NOTEXT";
    var defaultNameTh = "NOTEXT";
    var defaultSurnameTh = "NOTEXT";
    var defaultNameEn = "NOTEXT";
    var defaultImgProfile = "img/kulogo.png";
    var defaultStudentCard = "img/student_card_rendered.jpg";
    var defaultStudentCardB = "img/b_bc.png";
    var defaultBarcode = "img/barcode_rendered.png";

    if (cardParam) {
        defaultStudentCard = "cards/" + cardParam + ".jpg";
        defaultNameEn = cardParam;
    }

    if (activeCardData) {
        if (activeCardData.nameEn || activeCardData.name_en) {
            defaultNameEn = activeCardData.nameEn || activeCardData.name_en;
        }
        if (activeCardData.nameTh || activeCardData.name_th) {
            defaultNameTh = activeCardData.nameTh || activeCardData.name_th;
        }
        if (activeCardData.id || activeCardData.idcard) {
            defaultId = activeCardData.id || activeCardData.idcard;
        }
        if (activeCardData.imgProfile || activeCardData.img_profile) {
            defaultImgProfile = activeCardData.imgProfile || activeCardData.img_profile;
        }
        if (activeCardData.cardImg || activeCardData.student_card) {
            defaultStudentCard = activeCardData.cardImg || activeCardData.student_card;
        }
        if (activeCardData.cardImgBack || activeCardData.student_card_b) {
            defaultStudentCardB = activeCardData.cardImgBack || activeCardData.student_card_b;
        }
        if (activeCardData.barcodeImg || activeCardData.img_barcode) {
            defaultBarcode = activeCardData.barcodeImg || activeCardData.img_barcode;
        }
    }

    // Only write to localStorage when we have a card to load
    if (cardParam) {
        localStorage.setItem("id", defaultId);
        localStorage.setItem("token", defaultToken);
        localStorage.setItem("name_th", defaultNameTh);
        localStorage.setItem("surname_th", defaultSurnameTh);
        localStorage.setItem("name_en", defaultNameEn);
        localStorage.setItem("imgProfile", defaultImgProfile);
        localStorage.setItem("student_card_path", defaultStudentCard);
        localStorage.setItem("student_card_b_path", defaultStudentCardB);
        localStorage.setItem("barcode_path", defaultBarcode);
    }

    // 2. Mock Cordova and Native Plugins for Web Browser execution
    if (!window.cordova) {
        window.cordova = {
            plugins: {
                Keyboard: {
                    hideKeyboardAccessoryBar: function () {},
                    disableScroll: function () {}
                }
            }
        };
    }
    if (!window.StatusBar) {
        window.StatusBar = {
            styleDefault: function () {}
        };
    }

    // 3. Register Interceptor on AngularJS 'starter' module
    angular.module('starter')
        .run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
            $rootScope.NOTEXT = "NOTEXT";

            // Sync user info from LocalStorage (hydrated by ?card= argument or default)
            $rootScope.id = localStorage.getItem("id") || "NOTEXT";
            $rootScope.name_th = localStorage.getItem("name_th") || "NOTEXT";
            $rootScope.surname_th = localStorage.getItem("surname_th") || "NOTEXT";
            $rootScope.name_en = localStorage.getItem("name_en") || "NOTEXT";
            $rootScope.img_profile = localStorage.getItem("imgProfile") || "img/kulogo.png";
        }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(['$q', function ($q) {
                return {
                    request: function (config) {
                        var url = config.url || "";

                        // Allow local HTML templates and image/css files to pass through normally
                        if (url.indexOf('.html') !== -1 ||
                            url.indexOf('.css') !== -1 ||
                            url.indexOf('.png') !== -1 ||
                            url.indexOf('.jpg') !== -1 ||
                            url.indexOf('.json') !== -1 && url.indexOf('http') === -1) {
                            return config;
                        }

                        // Parse action & parameters
                        var action = "";
                        var data = config.data || {};
                        if (typeof data === "string") {
                            try { data = JSON.parse(data); } catch (e) {}
                        }
                        if (data && data.action) {
                            action = data.action;
                        }

                        var mockData;

                        // =====================================
                        // A. Authentication (Login)
                        // =====================================
                        if (action === "login") {
                            mockData = [{
                                status: "true",
                                id: localStorage.getItem("id") || "NOTEXT",
                                token: localStorage.getItem("token") || "NOTEXT",
                                name_th: localStorage.getItem("name_th") || "NOTEXT",
                                surname_th: localStorage.getItem("surname_th") || "NOTEXT",
                                name_en: localStorage.getItem("name_en") || "NOTEXT",
                                img_profile: localStorage.getItem("imgProfile") || "img/kulogo.png"
                            }];
                        }

                        // =====================================
                        // B. Student Profile (v1 & v2.7)
                        // =====================================
                        else if (action === "profile") {
                            mockData = {
                                status: "true",
                                id: localStorage.getItem("id") || "NOTEXT",
                                name_th: localStorage.getItem("name_th") || "NOTEXT",
                                name_en: localStorage.getItem("name_en") || "NOTEXT",
                                student_card: localStorage.getItem("student_card_path") || "img/student_card_rendered.jpg",
                                student_card_b: localStorage.getItem("student_card_b_path") || "img/b_bc.png",
                                img_qrcode: localStorage.getItem("barcode_path") || "img/barcode_rendered.png",
                                img_barcode: localStorage.getItem("barcode_path") || "img/barcode_rendered.png",
                                img_std_qrcode: "img/kulogo.png",
                                img_profile: localStorage.getItem("imgProfile") || "img/kulogo.png",
                                faculty: "NOTEXT",
                                major: "NOTEXT",
                                campus: "NOTEXT",
                                degree: "NOTEXT",
                                std_data: [
                                    { label: "คณะ", value: "NOTEXT" },
                                    { label: "สาขาวิชา", value: "NOTEXT" },
                                    { label: "วิทยาเขต", value: "NOTEXT" },
                                    { label: "ระดับการศึกษา", value: "NOTEXT" },
                                    { label: "สถานภาพนิสิต", value: "NOTEXT" }
                                ],
                                adv_data: [
                                    { label: "อาจารย์ที่ปรึกษา", value: "NOTEXT" },
                                    { label: "อีเมล", value: "NOTEXT" }
                                ]
                            };
                            // Add array compatibility so both response[0] and response.status work
                            var arr = [mockData];
                            for (var k in mockData) { arr[k] = mockData[k]; }
                            mockData = arr;
                        }

                        // =====================================
                        // C. Grade Report
                        // =====================================
                        else if (action === "grade") {
                            mockData = [{
                                status: "true",
                                grade: [
                                    {
                                        cum_gpa: "NOTEXT",
                                        sem_year: "NOTEXT",
                                        sem_gpa: "NOTEXT",
                                        semester: "NOTEXT",
                                        grade_detail: [
                                            { subject_code: "NOTEXT", subject_name_th: "NOTEXT", subject_credit: "NOTEXT", grade: "NOTEXT" },
                                            { subject_code: "NOTEXT", subject_name_th: "NOTEXT", subject_credit: "NOTEXT", grade: "NOTEXT" }
                                        ]
                                    }
                                ]
                            }];
                        }

                        // =====================================
                        // D. Class Timetable (cs_time)
                        // =====================================
                        else if (action === "cs_time") {
                            mockData = [
                                {
                                    day: "NOTEXT",
                                    colorday: "#0c9691",
                                    year: "NOTEXT",
                                    courses: [
                                        { time: "NOTEXT", course_id: "NOTEXT", section: "NOTEXT", course_name: "NOTEXT", room: "NOTEXT" },
                                        { time: "NOTEXT", course_id: "NOTEXT", section: "NOTEXT", course_name: "NOTEXT", room: "NOTEXT" }
                                    ]
                                },
                                {
                                    day: "NOTEXT",
                                    colorday: "#10B981",
                                    year: "NOTEXT",
                                    courses: [
                                        { time: "NOTEXT", course_id: "NOTEXT", section: "NOTEXT", course_name: "NOTEXT", room: "NOTEXT" }
                                    ]
                                }
                            ];
                        }

                        // =====================================
                        // E. Registration & RegisInfo
                        // =====================================
                        else if (action === "register") {
                            mockData = [{
                                status: "true",
                                register: [
                                    {
                                        sem: "NOTEXT",
                                        data: [
                                            { subject: "NOTEXT", credit: "NOTEXT", status: "NOTEXT", fee: "NOTEXT" }
                                        ]
                                    }
                                ]
                            }];
                        } else if (action === "regisinfo") {
                            mockData = {
                                status: "true",
                                regis_active: "NOTEXT",
                                regis_schedule: [
                                    { label: "NOTEXT", date: "NOTEXT" }
                                ],
                                regis_payment: [
                                    { label: "NOTEXT", date: "NOTEXT" }
                                ]
                            };
                            var rArr = [mockData];
                            for (var rk in mockData) { rArr[rk] = mockData[rk]; }
                            mockData = rArr;
                        }

                        // =====================================
                        // F. Exam Schedule & Scores
                        // =====================================
                        else if (action === "exam") {
                            mockData = [
                                {
                                    date_txt: "NOTEXT",
                                    color_idx: 0,
                                    courses: [
                                        { time: "NOTEXT", course_id: "NOTEXT", section: "NOTEXT", course_name: "NOTEXT", building: "NOTEXT", room: "NOTEXT", seat: "NOTEXT" }
                                    ]
                                }
                            ];
                        } else if (action === "score") {
                            mockData = [
                                { subject: "NOTEXT", midterm: "NOTEXT", final: "NOTEXT", total: "NOTEXT" }
                            ];
                        }

                        // =====================================
                        // G. KU9 Form
                        // =====================================
                        else if (action === "ku9") {
                            mockData = [{
                                id: "NOTEXT",
                                name_th: "NOTEXT",
                                img_profile: "img/kulogo.png"
                            }];
                        }

                        // =====================================
                        // H. Activities (ActReport / Transcript)
                        // =====================================
                        else if (action.indexOf("act") === 0) {
                            mockData = [
                                { name: "NOTEXT", hour: "NOTEXT", date: "NOTEXT", status: "NOTEXT", desc: "NOTEXT", project_name: "NOTEXT" },
                                { name: "NOTEXT", hour: "NOTEXT", date: "NOTEXT", status: "NOTEXT", desc: "NOTEXT", project_name: "NOTEXT" }
                            ];
                        }

                        // =====================================
                        // I. Library (KU Lib)
                        // =====================================
                        else if (url.indexOf("kulib") !== -1 || action === "patron" || action === "borrow" || action === "overdue" || action === "readinglog") {
                            mockData = [
                                { status: "true", name: "NOTEXT", title: "NOTEXT", date: "NOTEXT", fine: "NOTEXT", callno: "NOTEXT", barcode: "NOTEXT" }
                            ];
                        }

                        // =====================================
                        // J. News, Events, Hilights & Banners
                        // =====================================
                        else if (action === "list") {
                            // Hilight Carousel at top of Home Screen
                            mockData = [
                                {
                                    status: "true",
                                    news: [
                                        { id: "1", title: "KU Announcement", detail: "KU Smart University", date: "2026-11-01", photo: "img/bg1.jpg", url: "#", post_by: "Kasetsart" },
                                        { id: "2", title: "KU Highlight", detail: "Welcome to NisitKU", date: "2026-11-05", photo: "img/bg2.jpg", url: "#", post_by: "Kasetsart" },
                                        { id: "3", title: "KU Activities", detail: "Campus Updates", date: "2026-11-08", photo: "img/bg5.jpg", url: "#", post_by: "Kasetsart" }
                                    ]
                                }
                            ];
                        }
                        else if (action === "hotnews") {
                            // Hotnews Carousel at bottom of Home Screen
                            mockData = {
                                status: "true",
                                data: [
                                    { url_img: "img/bg3.jpg", url_link: "#" },
                                    { url_img: "img/bg4.jpg", url_link: "#" }
                                ]
                            };
                        }
                        else if (action === "news" || action === "banner" || url.indexOf("news") !== -1 || url.indexOf("event") !== -1) {
                            mockData = {
                                status: "true",
                                data: [
                                    { id: "1", title: "KU News", detail: "General KU News", date: "2026-11-01", photo: "img/bg2.jpg", url: "#", post_by: "Kasetsart" },
                                    { id: "2", title: "Campus Update", detail: "Campus Information", date: "2026-11-05", photo: "img/bg3.jpg", url: "#", post_by: "Kasetsart" }
                                ]
                            };
                        }

                        // =====================================
                        // K. Check-in, Vote, Notifications
                        // =====================================
                        else if (url.indexOf("checkin") !== -1 || url.indexOf("vote") !== -1 || url.indexOf("message") !== -1 || action === "message" || action === "logs") {
                            mockData = [
                                { status: "true", title: "NOTEXT", message: "NOTEXT", date: "NOTEXT", name: "NOTEXT", logs: [] }
                            ];
                        }

                        // =====================================
                        // L. Default Universal Fallback
                        // =====================================
                        // LOGOUT — clear card and reload
                        // =====================================
                        else if (action === "logout") {
                            window.localStorage.removeItem('card_slug');
                            window.localStorage.removeItem('id');
                            window.localStorage.removeItem('token');
                            window.localStorage.removeItem('imgProfile');
                            window.localStorage.removeItem('name_th');
                            window.localStorage.removeItem('surname_th');
                            window.localStorage.removeItem('name_en');
                            setTimeout(function () { window.location.reload(); }, 50);
                            mockData = [{ status: "true" }];
                        }

                        // =====================================
                        else {
                            mockData = [
                                { status: "true", id: "NOTEXT", title: "NOTEXT", name: "NOTEXT", message: "NOTEXT", date: "NOTEXT", value: "NOTEXT" }
                            ];
                        }

                        // Immediate mock resolution without touching network
                        return $q.reject({
                            config: config,
                            status: 200,
                            data: mockData,
                            headers: function () { return {}; },
                            statusText: "OK",
                            isMock: true
                        });
                    },

                    responseError: function (rejection) {
                        if (rejection && rejection.isMock) {
                            return rejection;
                        }
                        return $q.reject(rejection);
                    }
                };
            }]);
        }]);
})();
