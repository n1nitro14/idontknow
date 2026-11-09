/**
 * NisitKU Authentic Mock & Data Layer
 * Intercepts network requests and returns genuine captured NisitKU data.
 * All dynamic UI sections display official university data while preserving 100% original layout.
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

    // 1. Initialize LocalStorage with genuine defaults
    var defaultId = "6820105843";
    var defaultToken = "5QtAdyrAe560867b";
    var defaultNameTh = "พรเทพ";
    var defaultSurnameTh = "พุฒอินทร์";
    var defaultNameEn = "Phonthep";
    var defaultSurnameEn = "PHUTIN";
    var defaultImgProfile = "img/student_photo.jpg";
    var defaultStudentCard = "img/card_front.png";
    var defaultStudentCardB = "img/card_back.png";
    var defaultBarcode = "img/barcode.png";
    var defaultFaculty = "เกษตร กำแพงแสน";
    var defaultCampus = "กำแพงแสน";
    var defaultLevel = "ปริญญาตรี";
    var defaultStdStatus = "กำลังศึกษา";
    var defaultAdvName = "ไม่มีรหัสอาจารย์ที่ปรึกษา .";
    var defaultAdvEmail = "-";

    if (cardParam) {
        defaultStudentCard = "cards/" + cardParam + ".jpg";
        defaultNameEn = cardParam;
    }

    if (activeCardData) {
        defaultSurnameTh = "";
        defaultSurnameEn = "";

        if (activeCardData.name_th) {
            defaultNameTh = activeCardData.name_th;
        } else if (activeCardData.nameTh) {
            var pTh = activeCardData.nameTh.trim().split(" ");
            defaultNameTh = pTh[0];
            if (pTh.length > 1) {
                defaultSurnameTh = pTh.slice(1).join(" ");
            }
        }
        if (activeCardData.surname_th) {
            defaultSurnameTh = activeCardData.surname_th;
        }

        if (activeCardData.name_en) {
            defaultNameEn = activeCardData.name_en;
        } else if (activeCardData.nameEn) {
            var pEn = activeCardData.nameEn.trim().split(" ");
            defaultNameEn = pEn[0];
            if (pEn.length > 1) {
                defaultSurnameEn = pEn.slice(1).join(" ");
            }
        }
        if (activeCardData.surname_en) {
            defaultSurnameEn = activeCardData.surname_en;
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
        if (activeCardData.faculty) {
            defaultFaculty = activeCardData.faculty;
        }
    }

    // Write to localStorage if not yet initialized or if specific card requested
    if (cardParam || !localStorage.getItem("id") || localStorage.getItem("id") === "NOTEXT") {
        localStorage.setItem("id", defaultId);
        localStorage.setItem("token", defaultToken);
        localStorage.setItem("name_th", defaultNameTh);
        localStorage.setItem("surname_th", defaultSurnameTh);
        localStorage.setItem("name_en", defaultNameEn);
        localStorage.setItem("surname_en", defaultSurnameEn);
        localStorage.setItem("imgProfile", defaultImgProfile);
        localStorage.setItem("student_card_path", defaultStudentCard);
        localStorage.setItem("student_card_b_path", defaultStudentCardB);
        localStorage.setItem("barcode_path", defaultBarcode);
        localStorage.setItem("faculty", defaultFaculty);
        localStorage.setItem("campus", defaultCampus);
        localStorage.setItem("level", defaultLevel);
        localStorage.setItem("std_status", defaultStdStatus);
        localStorage.setItem("adv_name", defaultAdvName);
        localStorage.setItem("adv_email", defaultAdvEmail);
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
            styleLightContent: function () {},
            styleDefault: function () {},
            backgroundColorByHexString: function () {}
        };
    }

    if (!navigator.splashscreen) {
        navigator.splashscreen = {
            hide: function () {},
            show: function () {}
        };
    }

    // Pre-loaded Genuine Datasets
    var GENUINE_GRADE = [{"status" : "true", "grade" : [{ "year" : "68", "semester" : "1", "sem_name" : "ต้น", "term_credit" : "18", "total_credit" : "18", "sm_gpa" : "2.08", "cum_gpa" : "2.08", "show" : false, "courses" : [{ "course_id" : "01355101", "course_name" : "English for Everyday Life", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "3", "score_cal" : "3", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01371111", "course_name" : "Information Media for Learning", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "1", "score_cal" : "1", "credit_cal" : "1", "credit_get" : "1" },{ "course_id" : "01403111", "course_name" : "General Chemistry", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "3", "score_cal" : "3", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01403112", "course_name" : "Laboratory in General Chemistry", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "1", "score_cal" : "1", "credit_cal" : "1", "credit_get" : "1" },{ "course_id" : "01999021", "course_name" : "Thai Language for Academic and Professional Communication", "regis_type" : "C", "grade" : "C", "score" : "2", "credit" : "3", "score_cal" : "6", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01999111", "course_name" : "Kasetsart Creating Knowledge of the Land", "regis_type" : "C", "grade" : "A", "score" : "4", "credit" : "2", "score_cal" : "8", "credit_cal" : "2", "credit_get" : "2" },{ "course_id" : "02036271", "course_name" : "Horticultural Science and Technology", "regis_type" : "C", "grade" : "C", "score" : "2", "credit" : "2", "score_cal" : "4", "credit_cal" : "2", "credit_get" : "2" },{ "course_id" : "02036299", "course_name" : "General Practicum", "regis_type" : "C", "grade" : "A", "score" : "4", "credit" : "2", "score_cal" : "8", "credit_cal" : "2", "credit_get" : "2" },{ "course_id" : "02999144", "course_name" : "Life Skill for Undergraduate Student", "regis_type" : "C", "grade" : "B+", "score" : "3.5", "credit" : "1", "score_cal" : "3.5", "credit_cal" : "1", "credit_get" : "1" }]},{ "year" : "68", "semester" : "2", "sem_name" : "ปลาย", "term_credit" : "18", "total_credit" : "36", "sm_gpa" : "1.36", "cum_gpa" : "1.72", "show" : false, "courses" : [{ "course_id" : "01175143", "course_name" : "Social Dance for Health", "regis_type" : "C", "grade" : "F", "score" : "0", "credit" : "1", "score_cal" : "0", "credit_cal" : "1", "credit_get" : "1" },{ "course_id" : "01355102", "course_name" : "English for University Life", "regis_type" : "C", "grade" : "F", "score" : "0", "credit" : "3", "score_cal" : "0", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01403221", "course_name" : "Organic Chemistry", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "3", "score_cal" : "3", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01403222", "course_name" : "Laboratory in Organic Chemistry", "regis_type" : "C", "grade" : "C", "score" : "2", "credit" : "1", "score_cal" : "2", "credit_cal" : "1", "credit_get" : "1" },{ "course_id" : "01424111", "course_name" : "Principles of Biology", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "3", "score_cal" : "3", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01424112", "course_name" : "Laboratory for Biology", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "1", "score_cal" : "1", "credit_cal" : "1", "credit_get" : "1" },{ "course_id" : "01999011", "course_name" : "Food for Mankind", "regis_type" : "C", "grade" : "B+", "score" : "3.5", "credit" : "3", "score_cal" : "10.5", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "02036111", "course_name" : "Overview in Agriculture", "regis_type" : "C", "grade" : "B", "score" : "3", "credit" : "1", "score_cal" : "3", "credit_cal" : "1", "credit_get" : "1" },{ "course_id" : "02036231", "course_name" : "Crop Science and Technology", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "2", "score_cal" : "2", "credit_cal" : "2", "credit_get" : "2" }]},{ "year" : "69", "semester" : "0", "sem_name" : "ฤดูร้อน", "term_credit" : "6", "total_credit" : "42", "sm_gpa" : "2.00", "cum_gpa" : "1.76", "show" : false, "courses" : [{ "course_id" : "01459101", "course_name" : "Psychology for Modern Life", "regis_type" : "C", "grade" : "B", "score" : "3", "credit" : "3", "score_cal" : "9", "credit_cal" : "3", "credit_get" : "3" },{ "course_id" : "01355102", "course_name" : "English for University Life", "regis_type" : "C", "grade" : "D", "score" : "1", "credit" : "3", "score_cal" : "3", "credit_cal" : "3", "credit_get" : "3" }]},{ "year" : "69", "semester" : "1", "sem_name" : "ต้น", "term_credit" : "15", "total_credit" : "57", "sm_gpa" : "", "cum_gpa" : "1.76", "show" : false, "courses" : [{ "course_id" : "01419211", "course_name" : "General Microbiology", "regis_type" : "C", "grade" : "-", "score" : "", "credit" : "3", "score_cal" : "0", "credit_cal" : "0", "credit_get" : "0" },{ "course_id" : "01419214", "course_name" : "Laboratory in Fundamental Microbiology", "regis_type" : "C", "grade" : "-", "score" : "", "credit" : "1", "score_cal" : "0", "credit_cal" : "0", "credit_get" : "0" },{ "course_id" : "01999033", "course_name" : "Arts of Living", "regis_type" : "C", "grade" : "-", "score" : "", "credit" : "3", "score_cal" : "0", "credit_cal" : "0", "credit_get" : "0" },{ "course_id" : "02036241", "course_name" : "Introduction to Entomology", "regis_type" : "C", "grade" : "-", "score" : "", "credit" : "3", "score_cal" : "0", "credit_cal" : "0", "credit_get" : "0" },{ "course_id" : "02036312", "course_name" : "Safety and Innovation of Agricultural and Food Products", "regis_type" : "C", "grade" : "-", "score" : "", "credit" : "2", "score_cal" : "0", "credit_cal" : "0", "credit_get" : "0" },{ "course_id" : "02039211", "course_name" : "Creation and Development of Agricultural and Food Product Innovation", "regis_type" : "C", "grade" : "-", "score" : "", "credit" : "3", "score_cal" : "0", "credit_cal" : "0", "credit_get" : "0" }]}]}];
    var GENUINE_CSTIME = [{"status" : "true",  "academic_year" : "2569",  "semester" : "ภาคต้น",  "color_day" : {"Monday":"#f7f4a7","Tuesday":"#f6caf3","Wednesday":"#cafade","Thursday":"#ffcda3","Friday":"#dbfbff","Saturday":"#c4abed","Sunday":"#ffaab5"}, "cstime" : [{ "day" : "Monday", "courses" : [{ "time" : "13:00-16:00", "course_id" : "02036241", "course_name" : "Introduction to Entomology", "section" : "711", "room" : "LH3-306/เรือนปฏิบัติการกีฏวิทยา" }]},{ "day" : "Tuesday", "courses" : [{ "time" : "8:30-10:30", "course_id" : "02036312", "course_name" : "Safety and Innovation of Agricultural and Food Products", "section" : "700", "room" : "LH3-211" },{ "time" : "10:30-12:00", "course_id" : "01419211", "course_name" : "General Microbiology", "section" : "700", "room" : "LH4-301" },{ "time" : "13:00-14:30", "course_id" : "01999033", "course_name" : "Arts of Living", "section" : "702", "room" : "LH4-301" }]},{ "day" : "Wednesday", "courses" : [{ "time" : "15:00-18:00", "course_id" : "02039211", "course_name" : "Creation and Development of Agricultural and Food Product Innovation", "section" : "711", "room" : "LH4-610" }]},{ "day" : "Thursday", "courses" : [{ "time" : "10:30-12:00", "course_id" : "01419211", "course_name" : "General Microbiology", "section" : "700", "room" : "LH4-301" },{ "time" : "13:00-14:30", "course_id" : "01999033", "course_name" : "Arts of Living", "section" : "702", "room" : "LH4-301" }]},{ "day" : "Friday", "courses" : [{ "time" : "8:00-10:00", "course_id" : "02039211", "course_name" : "Creation and Development of Agricultural and Food Product Innovation", "section" : "700", "room" : "LH3-204" },{ "time" : "10:00-12:00", "course_id" : "02036241", "course_name" : "Introduction to Entomology", "section" : "700", "room" : "LH4-103" },{ "time" : "13:00-16:00", "course_id" : "01419214", "course_name" : "Laboratory in Fundamental Microbiology", "section" : "729", "room" : "SC14-424" }]}],  "timetable_light_p" : "https://kuappstore.ku.ac.th/nisitku/timetable.php?layout=portrait&img=bWF2RkZFNFRCVWFiZmVDN2E5ZUshNjgyMDEwNTg0MyFsaWdodA==",  "timetable_dark_p" : "https://kuappstore.ku.ac.th/nisitku/timetable.php?layout=portrait&img=bWF2RkZFNFRCVWFiZmVDN2E5ZUshNjgyMDEwNTg0MyFkYXJr",  "timetable_light" : "https://kuappstore.ku.ac.th/nisitku/timetable.php?img=bWF2RkZFNFRCVWFiZmVDN2E5ZUshNjgyMDEwNTg0MyFsaWdodA==",  "timetable_dark" : "https://kuappstore.ku.ac.th/nisitku/timetable.php?img=bWF2RkZFNFRCVWFiZmVDN2E5ZUshNjgyMDEwNTg0MyFkYXJr" }];
    var GENUINE_REGISTER = [{"status" : "true", "register" : [{ "year" : "68", "semester" : "1", "sem_name" : "ต้น", "show" : false, "term_credit" : "18", "total_credit" : "18", "courses" : [{ "course_id" : "01355101", "course_name" : "English for Everyday Life", "regis_type" : "C", "lec_section" : "716", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01371111", "course_name" : "Information Media for Learning", "regis_type" : "C", "lec_section" : "707", "lab_section" : "0", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "01403111", "course_name" : "General Chemistry", "regis_type" : "C", "lec_section" : "702", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01403112", "course_name" : "Laboratory in General Chemistry", "regis_type" : "C", "lec_section" : "0", "lab_section" : "713", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "01999021", "course_name" : "Thai Language for Academic and Professional Communication", "regis_type" : "C", "lec_section" : "701", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01999111", "course_name" : "Kasetsart Creating Knowledge of the Land", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "2", "credit_cal" : "2", "drop_w" : "" },{ "course_id" : "02036271", "course_name" : "Horticultural Science and Technology", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "2", "credit_cal" : "2", "drop_w" : "" },{ "course_id" : "02036299", "course_name" : "General Practicum", "regis_type" : "C", "lec_section" : "0", "lab_section" : "711", "credit" : "2", "credit_cal" : "2", "drop_w" : "" },{ "course_id" : "02999144", "course_name" : "Life Skill for Undergraduate Student", "regis_type" : "C", "lec_section" : "701", "lab_section" : "0", "credit" : "1", "credit_cal" : "1", "drop_w" : "" }]},{ "year" : "68", "semester" : "2", "sem_name" : "ปลาย", "show" : false, "term_credit" : "18", "total_credit" : "36", "courses" : [{ "course_id" : "01175143", "course_name" : "Social Dance for Health", "regis_type" : "C", "lec_section" : "0", "lab_section" : "711", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "01355102", "course_name" : "English for University Life", "regis_type" : "C", "lec_section" : "718", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01403221", "course_name" : "Organic Chemistry", "regis_type" : "C", "lec_section" : "701", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01403222", "course_name" : "Laboratory in Organic Chemistry", "regis_type" : "C", "lec_section" : "0", "lab_section" : "728", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "01424111", "course_name" : "Principles of Biology", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01424112", "course_name" : "Laboratory for Biology", "regis_type" : "C", "lec_section" : "0", "lab_section" : "731", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "01999011", "course_name" : "Food for Mankind", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "02036111", "course_name" : "Overview in Agriculture", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "02036231", "course_name" : "Crop Science and Technology", "regis_type" : "C", "lec_section" : "701", "lab_section" : "0", "credit" : "2", "credit_cal" : "2", "drop_w" : "" }]},{ "year" : "69", "semester" : "0", "sem_name" : "ฤดูร้อน", "show" : false, "term_credit" : "6", "total_credit" : "42", "courses" : [{ "course_id" : "01459101", "course_name" : "Psychology for Modern Life", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "01355102", "course_name" : "English for University Life", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" }]},{ "year" : "69", "semester" : "1", "sem_name" : "ต้น", "show" : false, "term_credit" : "15", "total_credit" : "57", "courses" : [{ "course_id" : "01419211", "course_name" : "General Microbiology", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "3", "credit_cal" : "0", "drop_w" : "W" },{ "course_id" : "01419214", "course_name" : "Laboratory in Fundamental Microbiology", "regis_type" : "C", "lec_section" : "0", "lab_section" : "729", "credit" : "1", "credit_cal" : "1", "drop_w" : "" },{ "course_id" : "01999033", "course_name" : "Arts of Living", "regis_type" : "C", "lec_section" : "702", "lab_section" : "0", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "02036241", "course_name" : "Introduction to Entomology", "regis_type" : "C", "lec_section" : "700", "lab_section" : "700-711", "credit" : "3", "credit_cal" : "3", "drop_w" : "" },{ "course_id" : "02036312", "course_name" : "Safety and Innovation of Agricultural and Food Products", "regis_type" : "C", "lec_section" : "700", "lab_section" : "0", "credit" : "2", "credit_cal" : "2", "drop_w" : "" },{ "course_id" : "02039211", "course_name" : "Creation and Development of Agricultural and Food Product Innovation", "regis_type" : "C", "lec_section" : "700", "lab_section" : "700-711", "credit" : "3", "credit_cal" : "3", "drop_w" : "" }]}]}];
    var GENUINE_REGISINFO = [{ "id" : "6820105843", "regis_active" : "ตรวจสอบข้อมูลที่ระบบ my.ku", "debt_cond" : "-", "lock_cond" : "-", "lock_list" : [], "grp" : "1", "start_date_regis" : "", "end_date_regis" : "", "time_regis" : "-", "start_date_regis_late" : "", "end_date_regis_late" : "", "time_regis_late" : "", "start_date_ku9" : "", "end_date_ku9" : "", "bank_name" : "ธนาคารไทยพาณิชย์", "bank_money" : "17,800", "bank_date" : "11 มิถุนายน 2569", "probation_name" : "-", "fee_name" : "-", "payment_name" : "-", "late_name" : "-", "std_status" : "Active", "status" : "true" }];
    var GENUINE_ACTREPORT = [{ "id" : "6820105843", "name" : "นายพรเทพ พุฒอินทร์", "campus" : "วิทยาเขตกำแพงแสน", "faculty" : "เกษตร กำแพงแสน", "major" : "นวัตกรรมผลิตภัณฑ์เกษตรและอาหาร", "std_status" : "C (กำลังศึกษา)", "activity_status" : "PASS", "link_html" : "http://nisit-ku.ku.ac.th/WebForm_report_std_B5.aspx?stdid=6820105843&link=1&ku=1", "link_pdf" : "http://nisit-ku.ku.ac.th/WebForm_report_std_B7.aspx?stdid=6820105843&ku=1&paper=pdf", "link_doc" : "http://nisit-ku.ku.ac.th/", "link_xls" : "http://nisit-ku.ku.ac.th/", "link_html2" : "http://nisit-ku.ku.ac.th/WebForm_report_std_B3.aspx?stdid=6820105843&link=1", "group_label" : ["1. กิจกรรมมหาวิทยาลัย","2. กิจกรรมเพื่อเสริมสร้างสมรรถนะ","3. กิจกรรมเพื่อสังคม","4. เข้าร่วมกิจกรรมในฐานะกรรมการบริหารองค์กรกิจกรรมนิสิต","5. ได้รับคัดเลือกให้เป็นนิสิตดีเด่นตามประกาศของมหาวิทยาลัย"], "status" : "true" }];
    var GENUINE_ACTCALENDAR = [{ "html_content" : "  <div class=\"row\">    <div class=\"col\">      <div class=\"list card\" style=\"margin:0em;padding:0px;\">        <a class=\"item item-image\" href=\"#/nisit_activity/act-calendar/1\">        <!-- ng-click=\"openURL('http://nisit.kasetsart.org/WebFormMainFrame_Main.aspx?campus=1');\"> -->          <img src=\"./img/bk.jpg\"><br>บางเขน        </a>      </div>    </div>    <div class=\"col\">      <div class=\"list card\" style=\"margin:0em;padding:0px;\">        <a class=\"item item-image\" href=\"#/nisit_activity/act-calendar/2\">        <!-- ng-click=\"openURL('http://nisit.kasetsart.org/WebFormMainFrame_Main.aspx?campus=2');\"> -->          <img src=\"./img/kps.jpg\"><br>กำแพงแสน        </a>      </div>    </div>  </div>  <div class=\"row\">    <div class=\"col\">      <div class=\"list card\" style=\"margin:0em;padding:0px;\">        <a class=\"item item-image\" ng-click=\"openURL('http://nisit.kasetsart.org/WebFormMainFrame_Main.aspx?campus=4');\">          <img src=\"./img/sk.jpg\"><br>สกลนคร        </a>      </div>    </div>    <div class=\"col\">      <div class=\"list card\" style=\"margin:0em;padding:0px;\">        <a class=\"item item-image\" ng-click=\"openURL('http://nisit.kasetsart.org/WebFormMainFrame_Main.aspx?campus=5');\">          <img src=\"./img/sp.jpg\"><br>สุพรรณบุรี        </a>      </div>    </div>  </div>  <div class=\"row\">    <div class=\"col\">      <div class=\"list card\" style=\"margin:0em;padding:0px;\">        <a class=\"item item-image\" ng-click=\"openURL('http://nisit.kasetsart.org/WebFormMainFrame_Main.aspx?campus=3');\">          <img src=\"./img/sri.jpg\"><br>ศรีราชา        </a>      </div>    </div>    <div class=\"col\">      <div class=\"list card\" style=\"margin:0em;padding:0px;\">        <a class=\"item item-image\" ng-click=\"openURL('http://nisit.kasetsart.org/WebFormMainFrame_Main.aspx?campus=6');\">          <img src=\"./img/som.jpg\"><br>สถาบันสมทบ        </a>      </div>    </div>  </div>  ",  "status" : "true" }];
    var GENUINE_KU9 = [{ "id" : "6820105843", "student_status" : "กำลังศึกษา", "name_th" : "พรเทพ พุฒอินทร์", "name_en" : "Phonthep PHUTIN", "major_th" : "นวัตกรรมผลิตภัณฑ์เกษตรและอาหาร", "major_en" : "", "faculty_th" : "เกษตร กำแพงแสน", "faculty_en" : "Agriculture at Kamphaeng Saen", "campus_th" : "กำแพงแสน", "campus_en" : "Kampaengsan", "level_th" : "ปริญญาตรี", "level_en" : "Bachelor Degree", "degree_th" : "วท.บ. (เกษตรศาสตร์)", "degree_en" : "B.S. (Agriculture)", "advname_th" : "ไม่มีรหัสอาจารย์ที่ปรึกษา .", "advname_en" : "", "adv_email" : ".@ku.ac.th", "img_profile" : "https://kuappstore.ku.ac.th/nisitku/img/profile_icon.png", "Msg_Info" : "รหัส ERP ของหน่วยงานที่นิสิตสังกัดไม่มี<br>ติดต่อ กองบริการการศึกษา กพส.<br>โทร: 02-9428200 ต่อ 633261 ถึง 633263 ต่อ 101 หรือ 111", "Yr" : "ปีการศึกษา 2558", "Sm" : "1", "Name_sm" : "ภาคต้น", "KU9" : [{ "tax_no" : "0994000159382", "campus_cs" : "01", "ref_1" : "5061158153512888", "ref_2" : "358111374009211", "desc" : "ค่าลงทะเบียนเรียน", "money" : "25,000.00", "img_barcode" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=EfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyNTAwMDAw",  "img_barcode_n" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=NfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyNTAwMDAw" },{ "tax_no" : "0994000159382", "campus_cs" : "01", "ref_1" : "5061158153512888", "ref_2" : "358111374009211", "desc" : "ค่าลงทะเบียน (รายวิชาสหกิจศึกษา)", "money" : "20,000.00", "img_barcode" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=EfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyMDAwMDAw",  "img_barcode_n" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=NfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyMDAwMDAw" },{ "tax_no" : "0994000159382", "campus_cs" : "01", "ref_1" : "5061158153512888", "ref_2" : "358111374009211", "desc" : "ค่าลงทะเบียน (รักษาสถานภาพนิสิต)", "money" : "22,000.00", "img_barcode" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=EfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyMjAwMDAw",  "img_barcode_n" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=NfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyMjAwMDAw" },{ "tax_no" : "0994000159382", "campus_cs" : "01", "ref_1" : "5061158153512888", "ref_2" : "358111374009211", "desc" : "ค่าลงทะเบียน (ล่าช้า/ชำระเพิ่ม)", "money" : "25,000.00", "img_barcode" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=EfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyNTAwMDAw",  "img_barcode_n" : "https://kuappstore.ku.ac.th/nisitku/barcode/barcode.php?img=NfDA5OTQwMDAxNTkzODIwMTo1MDYxMTU4MTUzNTEyODg4OjM1ODExMTM3NDAwOTIxMToyNTAwMDAw" }],  "CompCode" : [{ "text" : "<div class=\"row\" ><div class=\"col col-10\"></div><div class=\"col col-20 verticalItemImage\"><center><img src=\"https://kuappstore.ku.ac.th/nisitku/img/kulogo.png\"></center></div><div class=\"col col-offset verticalListItem\">รหัสผู้เสียภาษีอากร : 0994000159382<br><font class=\"actionsheetfont\">รหัสวิทยาเขต : 01</font></div></div>" },{ "text" : "<div class=\"row\" ><div class=\"col col-10\"></div><div class=\"col col-20 verticalItemImage\"><center><img src=\"https://kuappstore.ku.ac.th/nisitku/img/ktb.png\"></center></div><div class=\"col col-offset verticalListItem\">ธ.กรุงไทย จำกัด (มหาชน)<br><font class=\"actionsheetfont\">COMP CODE: 8689</font></div></div>" },{ "text" : "<div class=\"row\" ><div class=\"col col-10\"></div><div class=\"col col-20 verticalItemImage\"><center><img src=\"https://kuappstore.ku.ac.th/nisitku/img/bbl.png\"></center></div><div class=\"col col-offset verticalListItem\">ธ.กรุงเทพฯ จำกัด (มหาชน)<br><font class=\"actionsheetfont\">Br.no. 1081 SERVICE CODE: KUB</font></div></div>" },{ "text" : "<div class=\"row\" ><div class=\"col col-10\"></div><div class=\"col col-20 verticalItemImage\"><center><img src=\"https://kuappstore.ku.ac.th/nisitku/img/bay.png\"></center></div><div class=\"col col-offset verticalListItem\">ธ.กรุงศรีอยุธยา จำกัด (มหาชน)<br><font class=\"actionsheetfont\">COMP CODE: 54114</font></div></div>" },{ "text" : "<div class=\"row\" ><div class=\"col col-10\"></div><div class=\"col col-20 verticalItemImage\"><center><img src=\"https://kuappstore.ku.ac.th/nisitku/img/scb.png\"></center></div><div class=\"col col-offset verticalListItem\">ธ.ไทยพาณิชย์ จำกัด (มหาชน)<br><font class=\"actionsheetfont\">COMP CODE: 2723 (235-3-00009-4)</font></div></div>" },{ "text" : "<div class=\"row\" ><div class=\"col col-10\"></div><div class=\"col col-20 verticalItemImage\"><center><img src=\"https://kuappstore.ku.ac.th/nisitku/img/tmb.png\"></center></div><div class=\"col col-offset verticalListItem\">ธ.ทหารไทย จำกัด (มหาชน)<br><font class=\"actionsheetfont\">COMP.CODE 806</font></div></div>" }],  "status" : "true" }];
    var GENUINE_EULA = [{"status" : "true",  "data" : [{ "title" : "Terms of Use",  "html_content" : "<div style=\"padding:10px;color:#666;\"><b>ข้อตกลงการใช้งาน</b><br>ข้อตกลงการใช้งานนี้มีผลบังคับใช้ ณ วันที่ 1 สิงหาคม 256ึ7<br>การเข้าถึงหรือการใช้แอปพลิเคชัน NisitKU บริการ NisitKU หรือเว็บไซต์ใดๆ ที่จัดให้มาโดย NisitKU (รวมกันเรียกว่า \"บริการ\") ไม่ว่าจะเข้าถึงด้วยวิธีใด หมายความว่าคุณยินยอมให้ถูกผูกมัดด้วยข้อตกลงการใช้งานนี้ (\"ข้อตกลงการใช้งาน\") บริการนี้มี NisitKU เป็นเจ้าของหรือควบคุม ข้อตกลงการใช้งานนี้มีผลต่อสิทธิ์และข้อผูกมัดตามกฎหมายของคุณ<br><b>ข้อตกลงพื้นฐาน</b><br>    1. คุณต้องเป็นนิสิตมหาวิทยาลัยเกษตรศาสตร์เท่านั้น</br>    2. คุณจะเข้าใช้งานด้วยบัญชีผู้ใช้งานของมหาวิทยาลัย (Account Nontri)</br>    3. คุณต้องรับผิดชอบต่อการกระทำใดๆ ที่เกิดขึ้นผ่านบัญชีผู้ใช้ของคุณ และคุณตกลงว่าคุณจะไม่ขาย ถ่ายโอน ให้สิทธิ์หรือโอนสิทธิ์บัญชีผู้ใช้ ผู้ติดตาม ชื่อผู้ใช้ หรือสิทธิ์ของบัญชีผู้ใช้ใดๆ ของคุณ ยกเว้นบุคคลหรือธุรกิจที่ได้รับอนุมัติอย่างชัดแจ้ง</br>    4. คุณตกลงว่าคุณจะไม่เรียกร้อง รวบรวม หรือใช้ข้อมูลการเข้าสู่ระบบของผู้ใช้ NisitKU รายอื่น</br>    5. คุณมีความรับผิดชอบในการรักษารหัสผ่านของคุณให้เป็นความลับและปลอดภัย</br>    6. คุณจะต้องไม่ใช้บริการเพื่อวัตถุประสงค์ใดๆ ที่ผิดกฎหมายหรือไม่อนุญาต คุณตกลงที่จะปฏิบัติตามกฎหมาย กฎเกณฑ์และระเบียบทั้งหมด (เช่น ของรัฐบาลกลาง รัฐ ท้องถิ่นและมณฑล) ที่บังคับใช้กับการใช้บริการและเนื้อหาของคุณ (กำหนดไว้ด้านล่างนี้) ซึ่งรวมถึงแต่ไม่จำกัดเฉพาะกฎหมายลิขสิทธิ์</br>    7. คุณเป็นผู้รับผิดชอบแต่เพียงผู้เดียวสำหรับพฤติกรรมของคุณ ตลอดจนข้อมูล ไฟล์ข้อความ ข้อมูล ชื่อผู้ใช้ ภาพ กราฟิก รูปถ่าย ข้อมูลส่วนตัว และเนื้อหาหรือสื่ออื่นๆ (รวมเรียกว่า &quot;เนื้อหา&quot;)        ที่คุณส่ง โพสต์ หรือแสดงในบริการหรือผ่านบริการ</br>    8. คุณต้องไม่เปลี่ยนแปลง แก้ไข ดัดแปลง หรือปรับเปลี่ยนบริการ เพื่อให้ส่อเป็นเท็จว่าเกี่ยวข้องกับบริการหรือ NisitKU</br>    9. คุณต้องไม่เข้าถึง API ส่วนตัวของ NisitKU นอกเหนือจากที่ NisitKU อนุญาต</br>    10. คุณต้องไม่ใช้ชื่อโดเมนหรือ URL เว็บในชื่อผู้ใช้ของคุณ โดยปราศจากการยินยอมเป็นลายลักษณ์อักษรจาก NisitKU</br>    11. คุณต้องไม่รบกวนหรือขัดขวางการทำงานของบริการหรือเซิร์ฟเวอร์หรือเครือข่ายที่เชื่อมต่อกับบริการ รวมทั้งการส่งผ่านเวิร์ม ไวรัส สปายแวร์ มัลแวร์ หรือโค้ดอื่นใดในลักษณะที่ทำลายหรือขัดขวางการทำงาน คุณจะต้องไม่ป้อนเนื้อหาหรือโค้ด หรือปรับเปลี่ยนหรือรบกวนในทางอื่นๆ        ต่อวิธีการถ่ายทอดหรือแสดงหน้า NisitKU ใดๆ ในบราวเซอร์หรืออุปกรณ์ของผู้ใช้</br>    12. คุณต้องไม่สร้างบัญชีผู้ใช้กับบริการผ่านวิธีการที่ไม่อนุญาต ไม่จำกัดเฉพาะการใช้อุปกรณ์อัตโนมัติ แต่รวมถึงสคริปต์ บอท สไปเดอร์ ตัวตระเวน หรือตัวดึงข้อมูล</br>    13. คุณต้องไม่พยายามจำกัดผู้ใช้รายอื่นจากการใช้บริการ และคุณต้องไม่สนับสนุนหรือเอื้ออำนวยให้เกิดการละเมิดข้อตกลงการใช้งานนี้หรือข้อตกลงของ NisitKU อื่นใด</br>    การฝ่าฝืนข้อตกลงการใช้งานนี้อาจส่งผลให้สิ้นสุดบัญชีผู้ใช้ NisitKU ของคุณ ทั้งนี้อยู่ภายใต้ดุลพินิจของ NisitKU แต่เพียงผู้เดียว คุณเข้าใจและตกลงว่า NisitKU ไม่สามารถและจะไม่รับผิดชอบต่อเนื้อหาที่โพสต์ลงบนบริการ และคุณใช้บริการภายใต้ความเสี่ยงของคุณเอง    หากคุณฝ่าฝืนตัวบทและเจตนารมณ์ของข้อตกลงการใช้งานนี้ หรือทำให้เกิดความเสี่ยงอื่นใด หรือทำให้ NisitKU ตกอยู่ในความเสี่ยงต่อกฎหมายที่เป็นไปได้ เราสามารถยุติการให้บริการทั้งหมดหรือบางส่วนแก่คุณได้</br>    <br>    <b>เงื่อนไขทั่วไป</b>    <br>1. สงวนสิทธิ์ในการปรับเปลี่ยนหรือสิ้นสุดบริการหรือการเข้าถึงบริการของคุณด้วยเหตุผลใดๆ โดยไม่มีการบอกแจ้งได้ตลอดเวลาโดยไม่ต้องรับผิดต่อคุณ    <br>2. สงวนสิทธิ์ที่จะเปลี่ยนแปลงข้อตกลงการใช้งานนี้ (\"ข้อตกลงที่ปรับปรุงใหม่\") เป็นระยะๆ ภายใต้ดุลพินิจของเราแต่เพียงผู้เดียว เว้นแต่เราจะทำการเปลี่ยนแปลงด้วยเหตุผลทางกฎหมายหรือการบริหาร เราจะทำการแจ้งล่วงหน้าตามสมควรก่อนที่ข้อตกลงที่ปรับปรุงใหม่จะมีผลบังคับใช้ คุณตกลงว่าเราสามารถแจ้งให้คุณทราบถึงข้อตกลงที่ปรับปรุงใหม่โดยการโพสต์ลงบนบริการ และการใช้บริการของคุณภายหลังวันที่บังคับใช้ข้อตกลงที่ปรับปรุงใหม่ (หรือการเข้าร่วมในพฤติกรรมอื่นที่เราอาจระบุตามสมควร) ทำให้เกิดข้อตกลงของคุณต่อข้อตกลงที่ปรับปรุงใหม่นี้ เพราะฉะนั้น คุณควรจะทบทวนข้อตกลงการใช้งานนี้และข้อตกลงที่ปรับปรุงใหม่ใดๆ ก่อนที่จะใช้บริการ ข้อตกลงที่ปรับปรุงใหม่จะมีผลบังคับใช้ ณ เวลาที่โพสต์หรือเวลาหลังจากนั้นตามที่อาจระบุไว้ในข้อตกลงที่ปรับปรุงใหม่ และจะบังคับใช้กับการใช้บริการของคุณจากจุดนั้นเป็นต้นมา ข้อตกลงการใช้งานนี้จะใช้บังคับข้อขัดแย้งใดๆ ที่เกิดขึ้นก่อนวันที่บังคับใช้ของข้อตกลงที่ปรับปรุงใหม่    <br>3. ห้ามการตระเวน การดึงข้อมูล การแคช หรือการเข้าถึงอื่นใดๆ บนบริการโดยใช้วิธีการอัตโนมัติ ซึ่งรวมถึงแต่ไม่จำกัดเฉพาะข้อมูลส่วนตัวและรูปภาพของผู้ใช้ (ยกเว้นกรณีที่อาจเป็นผลของโปรโตคอลของโปรแกรมค้นหามาตรฐานหรือเทคโนโลยีที่ใช้โดยโปรแกรมค้นหา โดยมีการยินยอมอย่างชัดแจ้งของ NisitKU)</div>" },{ "title" : "Privacy Policy",  "html_content" : "<div style=\"padding:10px;color:#666;\"><b>นโยบายความเป็นส่วนตัว</b><br>มีผลบังคับใช้ ณ วันที่ 1 กันยายน 2017<br>ยินดีต้อนรับเข้าสู่ NisitKU (\"NisitKU\" \"เรา\" \"พวกเรา\" หรือ \"ของเรา\") นำเสนอหนทางที่รวดเร็ว งดงาม และสนุกสนานในการแชร์สื่อผ่านแพลตฟอร์มการแชร์เนื้อหาของเรา เพียงถ่ายภาพ เลือกฟิลเตอร์เพื่อเปลี่ยนลักษณะและอารมณ์ เพิ่มความคิดเห็น (หากคุณต้องการ) และแชร์!<br>- นโยบายความเป็นส่วนตัวของเราอธิบายวิธีที่เราและบางบริษัทที่เราร่วมงานด้วยรวบรวม ใช้ แชร์ และปกป้องข้อมูลที่สัมพันธ์กับบริการมือถือ เว็บไซต์ และซอฟต์แวร์ใดๆ ของเราที่มอบให้ใน NisitKU หรือผ่านการเชื่อมโยงกับบริการ NisitKU (ต่อไปนี้เรียกว่า \"บริการ\") และทางเลือกของคุณเกี่ยวกับการรวบรวมและการใช้ข้อมูลของคุณ<br>- โดยการใช้บริการของเรา คุณเข้าใจและยอมรับว่าเรากำลังนำเสนอแพลตฟอร์มสำหรับคุณในการโพสต์เนื้อหา ประกอบด้วยรูปภาพ ความคิดเห็น และวัตถุดิบอื่นๆ (\"เนื้อหาของผู้ใช้\") ไปยังบริการและเพื่อแชร์เนื้อหาของผู้ใช้แบบสาธารณะ ซึ่งหมายความว่าผู้ใช้รายอื่นสามารถค้นหา ดู ใช้ และแชร์เนื้อหาของผู้ใช้ใดๆ ที่คุณเผยแพร่ต่อสาธารณะผ่านบริการได้ โดยสอดคล้องกับข้อตกลงและเงื่อนไขของนโยบายความเป็นส่วนตัวและข้อตกลงใช้งานของเรา<br>- นโยบายของเราจะบังคับใช้กับผู้ชม ผู้ใช้ และผู้อื่นที่เข้าสู่บริการ (\"ผู้ใช้\")<br><b>1. ข้อมูลที่เรารวบรวม</b><br>เรารวบรวมข้อมูลในประเภทต่อไปนี้<br>ข้อมูลที่คุณให้กับเราโดยตรง:<br>- ชื่อผู้ใช้ รหัสผ่าน และที่อยู่อีเมลเมื่อคุณสมัครสมาชิกสำหรับบัญชีผู้ใช้<br>- ข้อมูลส่วนตัวที่คุณระบุเพื่อเป็นข้อมูลส่วนตัวของผู้ใช้ของคุณ (เช่น ชื่อและนามสกุล รูปภาพ หมายเลขโทรศัพท์ ฯลฯ)<br>- เนื้อหาของผู้ใช้ (เช่น รูปภาพ ความคิดเห็น และวัตถุดิบอื่นๆ) ที่คุณโพสต์ลงในการบริการ<br>- การสื่อสารระหว่างคุณกับ NisitKU เช่น เราอาจส่งอีเมลที่เกี่ยวข้องกับการบริการหาคุณ (เช่น การยืนยันบัญชีผู้ใช้ การเปลี่ยนแปลง/อัพเดตคุณสมบัติของบริการ การแจ้งเตือนทางเทคนิคและด้านความปลอดภัย) โปรดทราบว่าคุณจะไม่ถูกงดจากการรับอีเมลเกี่ยวกับการบริการ<br>ข้อมูลผลวิเคราะห์:<br>เราใช้เครื่องมือการวิเคราะห์บุคคลที่สามเพื่อช่วยเราในการวัดปริมาณการใช้งาน และแนวโน้มการใช้งานสำหรับบริการ เครื่องมือเหล่านี้รวบรวมข้อมูลที่ส่งจากอุปกรณ์ของคุณหรือบริการของเรา ประกอบด้วยหน้าเว็บที่คุณเข้าชม ส่วนเสริม และข้อมูลอื่นๆ ที่จะช่วยเราในการปรับปรุงบริการ เรารวบรวมและใช้ข้อมูลผลวิเคราะห์นี้จากผู้ใช้หลายราย ดังนั้นข้อมูลนี้จึงไม่สามารถใช้ในการระบุตัวตนผู้ใช้รายใดรายหนึ่งได้<br>เครื่องมือระบุอุปกรณ์:<br>เมื่อคุณใช้อุปกรณ์เคลื่อนที่ เช่น แท็บเล็ตหรือโทรศัพท์ ในการเข้าสู่บริการของเรา เราจะเข้าถึง รวบรวม ตรวจสอบ และ/หรือจัดเก็บ \"เครื่องมือระบุอุปกรณ์\" อย่างน้อยหนึ่งรายการบนอุปกรณ์ของคุณหรือแบบทางไกล เครื่องมือระบุอุปกรณ์เป็นไฟล์ข้อมูลเล็กๆ หรือโครงสร้างคล้ายๆ กันที่จัดเก็บไว้ในอุปกรณ์มือถือของคุณ หรือสัมพันธ์กับอุปกรณ์มือถือของคุณ ซึ่งจะระบุอุปกรณ์มือถือของคุณอย่างมีจุดเด่น เครื่องมือระบุอุปกรณ์อาจเป็นข้อมูลที่จัดเก็บไว้โดยเชื่อมโยงกับฮาร์ดแวร์ของอุปกรณ์ ข้อมูลที่จัดเก็บโดยเชื่อมโยงกับระบบปฏิบัติการของอุปกรณ์หรือซอฟต์แวร์อื่นๆ หรือข้อมูลที่ NisitKU ส่งไปยังอุปกรณ์นั้น<br>Metadata:<br>Metadata ส่วนใหญ่เป็นข้อมูลทางเทคนิคที่ไม่สัมพันธ์กับเนื้อหาของผู้ใช้ ตัวอย่างเช่น Metadata สามารถอธิบายวิธีการ เวลา และผู้ที่รวบรวมส่วนของเนื้อหาของผู้ใช้ และวิธีการจัดรูปแบบเนื้อหานั้นได้<br>ผู้ใช้สามารถเพิ่มหรือขอให้ผู้อื่นเพิ่ม Metadata ลงในเนื้อหาของผู้ใช้ของตนได้ ประกอบด้วยแฮชแท็ก (เช่น ในการระบุคำหลักเมื่อคุณโพสต์รูปภาพ) แท็กตำแหน่ง (เช่น ในการระบุตำแหน่งที่ตั้งในรูปภาพ) ความคิดเห็น หรือข้อมูลอื่นๆ ซึ่งจะทำให้ผู้อื่นสามารถค้นหาเนื้อหาของผู้ใช้ของคุณสามารถค้นหาได้ง่าย และมีการโต้ตอบมากขึ้น หากคุณแท็กตำแหน่งรูปภาพของคุณ หรือแท็กรูปภาพของคุณโดยใช้ API ของผู้อื่น เส้นรุ้งและเส้นแวงของคุณจะถูกจัดเก็บไว้กับรูปภาพ และสามารถค้นหาได้ (เช่น ผ่านคุณสมบัติตำแหน่งที่ตั้งหรือแผนที่) หากรูปภาพของคุณถูกทำให้เป็นสาธารณะด้วยตัวคุณเองตามการตั้งค่าความเป็นส่วนตัวของคุณ<br><b>2. วิธีการที่เราใช้งานข้อมูลของคุณ</b><br>นอกจากการใช้งานข้อมูลโดยเฉพาะเจาะจงบางประการที่เราอธิบายไว้ในนโยบายความเป็นส่วนตัวนี้ เราจะใช้ข้อมูลที่เราได้รับเพื่อ:<br>- ช่วยคุณในการเข้าสู่ข้อมูลของคุณหลังจากลงชื่อเข้าใช้แล้วอย่างมีประสิทธิภาพ<br>- จดจำข้อมูลเพื่อให้คุณไม่ต้องป้อนข้อมูลใหม่ในระหว่างการเข้าชมหรือครั้งต่อไปที่คุณเข้าสู่บริการ<br>- มอบเนื้อหาและข้อมูลที่มีการปรับให้เหมาะสมแก่คุณและผู้อื่น ซึ่งอาจรวมถึงโฆษณาออนไลน์และรูปแบบการตลาดอื่นๆ<br>- มอบ ปรับปรุง ทดสอบ และตรวจสอบประสิทธิภาพของบริการของเรา<br>- พัฒนาและปรับปรุงผลิตภัณฑ์และคุณสมบัติใหม่ๆ<br>- ตรวจสอบการวัดผล เช่น จำนวนรวมของผู้เข้าชม ปริมาณการใช้งาน และรูปแบบทางประชากร<br>- วินิจฉัยและซ่อมแซมปัญหาทางเทคโนโลยี<br><b>3. การแชร์ข้อมูลของคุณ</b><br>เราจะไม่ให้เช่าหรือขายข้อมูลของคุณแก่บุคคลที่สามนอกเหนือจาก NisitKU (หรือกลุ่มหรือบริษัทที่ NisitKU มีส่วนเกี่ยวข้อง) โดยไม่ได้รับความยินยอมจากคุณ<br><b>4. วิธีการที่เราจัดเก็บข้อมูลของคุณ</b><br>การจัดเก็บและประมวลผล:<br>ข้อมูลของคุณที่รวบรวมผ่านบริการจะถูกจัดเก็บและประมวลผลในประเทศไทย หากคุณอาศัยอยู่ในสหภาพยุโรปหรือภูมิภาคอื่นๆ ที่มีการเก็บและใช้ข้อมูลที่ควบคุมโดยกฎหมายที่อาจแตกต่างจากกฎหมายประเทศไทย โปรดทราบว่าเราอาจส่งข้อมูลนั้น รวมถึงข้อมูลส่วนตัว ไปยังประเทศและเขตอำนาจศาลที่ไม่มีกฎหมายการปกป้องข้อมูลเดียวกับเขตอำนาจศาลของคุณ<br>เราใช้การปกป้องที่สมเหตุสมผลทางพาณิชย์เพื่อช่วยรักษาข้อมูลที่รวบรวมผ่านบริการให้ปลอดภัย และดำเนินการอย่างสมเหตุสมผล (เช่น การขอรหัสผ่านที่ไม่ซ้ำใคร) ในการยืนยันตัวตนของคุณก่อนที่จะอนุญาตให้คุณเข้าถึงบัญชีผู้ใช้ของคุณ อย่างไรก็ตาม NisitKU ไม่สามารถยืนยันความปลอดภัยของข้อมูลใดๆ ที่คุณส่งมายัง NisitKU หรือรับรองว่าข้อมูลในบริการจะไม่มีผู้ใดเข้าถึง เปิดเผย เปลี่ยนแปลง หรือทำลายได้<br>โปรดดำเนินการในส่วนของคุณเพื่อช่วยเหลือเรา คุณต้องรับผิดชอบการรักษาความลับของรหัสผ่านที่ไม่ซ้ำใครและข้อมูลบัญชีผู้ใช้ของคุณ และการควบคุมการเข้าถึงอีเมลระหว่างคุณและ NisitKU ตลอดเวลา การตั้งค่าความเป็นส่วนตัวของคุณอาจได้รับผลกระทบจากการเปลี่ยนแปลงที่บริการสื่อสังคมที่คุณเชื่อมต่อกับ NisitKU ทำกับบริการของตนเอง เราจะไม่รับผิดชอบสำหรับฟังก์ชันการทำงาน ความเป็นส่วนตัว หรือมาตรการความปลอดภัยขององค์กรอื่นๆ<br><b>5. ทางเลือกของคุณเกี่ยวกับข้อมูลของคุณ</b><br>การตั้งค่าข้อมูลบัญชีผู้ใช้และข้อมูลส่วนตัว/ความเป็นส่วนตัวของคุณ:<br>- อัพเดตบัญชีผู้ใช้ของคุณเมื่อใดก็ได้ โดยการเข้าสู่ระบบและเปลี่ยนแปลงการตั้งค่าบัญชีผู้ใช้ของคุณ<br>ระยะเวลาจัดเก็บเนื้อหาของผู้ใช้ของเรา:<br>- หลังจากการยกเลิกหรือระงับใช้บัญชีผู้ใช้ของคุณแล้ว NisitKU จะเก็บข้อมูล (ประกอบด้วยข้อมูลส่วนตัวของคุณ) และเนื้อหาของผู้ใช้ไว้ในระยะเวลาที่เหมาะสมทางพาณิชย์เพื่อวัตถุประสงค์ในการสำรอง บันทึก และ/หรือตรวจสอบ<br><b>6. ความเป็นส่วนตัวของเด็ก</b><br>NisitKU จะไม่รวบรวมหรือขอข้อมูลใดๆ จากผู้มีอายุต่ำกว่า 13 ปี หรืออนุญาตให้บุคคลดังกล่าวลงทะเบียนสำหรับบริการทั้งที่ทราบดี บริการและเนื้อหาจะไม่มุ่งไปที่เด็กที่มีอายุต่ำกว่า 13 ปี ในกรณีที่เรารับทราบว่าเราได้รวบรวมข้อมูลส่วนบุคคลของเด็กอายุต่ำกว่า 13 ปีโดยไม่ได้รับอนุญาตจากผู้ปกครอง เราจะลบข้อมูลนั้นโดยเร็วที่สุด หากคุณเชื่อว่าเราอาจได้รับข้อมูลใดๆ จากเด็กอายุต่ำกว่า 13 ปี โปรดติดต่อเรา<br><b>7. เว็บไซต์และบริการอื่นๆ</b><br>เราจะไม่รับผิดชอบต่อแนวปฏิบัติที่จัดการโดยเว็บไซต์หรือบริการที่เชื่อมโยงกับบริการของเรา รวมถึงข้อมูลหรือเนื้อหาที่อยู่ในนั้น โปรดจำไว้ว่าเมื่อคุณใช้ลิงก์จากเว็บไซต์ของเราเพื่อไปยังเว็บไซต์หรือบริการอื่น นโยบายความเป็นส่วนตัวของเราจะไม่บังคับใช้กับเว็บไซต์หรือบริการบุคคลที่สามดังกล่าว การเรียกดูและการโต้ตอบบนเว็บไซต์หรือบริการบุคคลที่สาม รวมถึงเว็บไซต์หรือบริการที่มีลิงก์อยู่บนเว็บไซต์ของเรา จะอยู่ภายใต้กฎและนโยบายของบุคคลที่สามนั้นๆ นอกจากนี้ <br>คุณยอมรับว่าเราไม่สามารถรับผิดชอบและไม่มีอำนาจในการควบคุมบุคคลที่สามใดๆ ที่คุณอนุญาตให้เข้าถึงเนื้อหาของผู้ใช้ของคุณได้ หากคุณกำลังใช้เว็บไซต์หรือบริการบุคคลที่สาม และคุณอนุญาตให้พวกเขาเข้าถึงเนื้อหาของผู้ใช้ของคุณ คุณได้กระทำการดังกล่าวตามความเสี่ยงของคุณเอง<br><b>8. วิธีติดต่อเรา</b><br>หากคุณมีคำถามใดๆ เกี่ยวกับนโยบายความเป็นส่วนตัวหรือบริการนี้ โปรดค้นหาช่องทางการสนับสนุนที่เหมาะสม หรือติดต่อเราทางอีเมล kuappservice@gmail.com<br><b>9. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัวของเรา</b><br>NisitKU จะปรับเปลี่ยนและอัพเดตนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว ดังนั้น โปรดตรวจสอบนโยบายนี้เรื่อยๆ เราจะนำเสนอรูปแบบการแจ้งเตือนเพิ่มเติมเกี่ยวกับการแก้ไข หรืออัพเดตแก่คุณตามความเหมาะสมของสถานการณ์ การใช้งาน NisitKU หรือบริการอย่างต่อเนื่องของคุณหลังจากการแก้ไขนโยบายนี้ จะถือว่าคุณยอมรับการแก้ไขดังกล่าว" }]}];
    var GENUINE_MANUAL = [{ "buttonList" : [{ "text" : "คู่มือนิสิตปริญญาตรี" },{ "text" : "คู่มือนิสิตบัณฑิตศึกษา" }],  "urlList" : ["https://admission.ku.ac.th/#tab_round_6" ,"http://www.grad.ku.ac.th/wp-content/uploads/dlm_uploads/2019/07/stu-manual2562-total.pdf" ] }];
    var GENUINE_EVENTS = [{"status" : "true", "marker" : [{ "date" : "2026-11-02" },{ "date" : "2026-11-12" },{ "date" : "2026-11-13" },{ "date" : "2026-11-17" },{ "date" : "2026-11-23" },{ "date" : "2026-11-30" }], "events" : [{ "name" : "พฤศจิกายน 2569", "events" : [{ "id" : "1794189673", "start_event" : "2 พฤศจิกายน 2569", "end_event" : "3 พฤศจิกายน 2569", "event_name" : "วันแรกชำระค่าธรรมเนียมภาคปลาย 69 (ไทย)", "detail" : "ชำระเงินตั้งแต่ 2 - 13 พ.ย. 69", "url" : "https://registrar.ku.ac.th/", "cal_day" : "2", "cal_week" : "1", "enable_day" : "0", "photo" : "https://kuappstore.ku.ac.th/calendar/upload/photo/ku.jpg" },{ "id" : "1794189674", "start_event" : "12 พฤศจิกายน 2569", "end_event" : "13 พฤศจิกายน 2569", "event_name" : "วันสุดท้ายส่งคะเเนนสอบไล่ ภาคต้น 69 (หลักสูตรไทย)", "detail" : "", "url" : "https://registrar.ku.ac.th/", "cal_day" : "12", "cal_week" : "4", "enable_day" : "1", "photo" : "https://kuappstore.ku.ac.th/calendar/upload/photo/ku.jpg" },{ "id" : "1794189675", "start_event" : "13 พฤศจิกายน 2569", "end_event" : "14 พฤศจิกายน 2569", "event_name" : "วันสุดท้ายชำระค่าธรรมเนียมภาคปลาย 69 (ไทย)", "detail" : "ชำระเงินตั้งแต่ 2 - 13 พ.ย. 69", "url" : "https://registrar.ku.ac.th/", "cal_day" : "13", "cal_week" : "5", "enable_day" : "1", "photo" : "https://kuappstore.ku.ac.th/calendar/upload/photo/ku.jpg" },{ "id" : "1794189676", "start_event" : "17 พฤศจิกายน 2569", "end_event" : "21 พฤศจิกายน 2569", "event_name" : "ลงทะเบียนเรียน ภาคปลาย 69 (ไทย)", "detail" : "", "url" : "https://registrar.ku.ac.th/", "cal_day" : "17", "cal_week" : "2", "enable_day" : "1", "photo" : "https://kuappstore.ku.ac.th/calendar/upload/photo/ku.jpg" },{ "id" : "1794189677", "start_event" : "23 พฤศจิกายน 2569", "end_event" : "24 พฤศจิกายน 2569", "event_name" : "เปิดเทอม ภาคปลาย 69 (ไทย)", "detail" : "", "url" : "https://registrar.ku.ac.th/", "cal_day" : "23", "cal_week" : "1", "enable_day" : "1", "photo" : "https://kuappstore.ku.ac.th/calendar/upload/photo/ku.jpg" },{ "id" : "1794189678", "start_event" : "30 พฤศจิกายน 2569", "end_event" : "12 ธันวาคม 2569", "event_name" : "สอบไล่ภาคต้น 69 (inter)", "detail" : "", "url" : "https://registrar.ku.ac.th/", "cal_day" : "30", "cal_week" : "1", "enable_day" : "1", "photo" : "https://kuappstore.ku.ac.th/calendar/upload/photo/ku.jpg" }]}]}];
    var GENUINE_NEWS_PR = { "status" : "true" , "data" : [{ "id" : "38", "title" : "เปิดรับสมัครผู้สนใจสมัครเข้าร่วมกิจกรรมพัฒนาศักยภาพผู้ประกอบการนิสิตผ่านการจัดการธุรกิจจำลอง KASET FAIR KASET FUND", "detail" : "สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม เปิดรับสมัครผู้สนใจสมัครเข้าร่วมกิจกรรมพัฒนาศักยภาพผู้ประกอบการนิสิตผ่านการจัดการธุรกิจจำลอง KASET FAIR KASET FUND วันที่ 30 ม.ค. – 7 ก.พ. 2569 พื้นที่ 20 ร้านค้าโซนนิสิต ในงานเกษตรแฟร์ 2569 ผู้เข้าร่วมจะได้เรียนรู้และลงมือทำจริง ผ่านอบรม KU SDGs Smart Entrepreneur เข้าร่วม Pitching เพื่อชิงร้านค้าโซนนิสิต เรียนรู้การบริหารรายรับ–รายจ่าย และใช้ KUBIC Transaction App นำเสนอผลการดำเนินงานและส่งรายงาน ลุ้นรางวัลรวมกว่า 29,000 บาท สมัครเข้าร่วมกิจกรรม คลิกข้อมูลเพิ่มเติมด้านล่าง", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0xMS0wNV9rYXNldGZhaXIuanBn",  "url" : "https://docs.google.com/forms/d/e/1FAIpQLSdna05G2ormwIVeQImwiIUkwQYQNsxkmbRYzMA-8sS5HacvKw/viewform",  "post_by" : "สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 5 พ.ย. 2569" },{ "id" : "37", "title" : "เปิดรับข้อเสนอโครงการ TED Youth Startup 2027 ทุนสนับสนุนนิสิตและบัณฑิตจบใหม่ สู่การเป็นผู้ประกอบการ", "detail" : "สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม เปิดรับข้อเสนอโครงการ TED Youth Startup 2027 ทุนสนับสนุนนิสิตและบัณฑิตจบใหม่ สู่การเป็นผู้ประกอบการ รับสมัครตั้งแต่วันนี้ – 22 ตุลาคม 2569 แบบฟอร์มใบสมัครและรายละเอียดโครงการ คลิก ข้อมูลเพิ่มเติม ด้านล่าง", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0xMC0wNl90ZWQyMDI3LmpwZw==",  "url" : "https://docs.google.com/forms/d/e/1FAIpQLScL_n76QEmD4C5DSP9PzarGsrHt7BRWW2ZxgFQHP9jTtk5cGA/viewform",  "post_by" : "สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 6 ต.ค. 2569" },{ "id" : "36", "title" : "ประกาศมหาวิทยาลัยเกษตรศาสตร์ ฉบับที่ 4 เรื่อง ปิดทำการและงดการเรียนการสอนในพื้นที่บางเขน เป็นกรณีพิเศษ ประกาศ ณ วันที่ 27 กันยายน 2569", "detail" : "ฉบับที่ 4 เรื่อง ปิดทำการและงดการเรียนการสอนในพื้นที่บางเขน เป็นกรณีพิเศษ ประกาศ ณ วันที่ 27 กันยายน 2569", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wOS0yN19mbG9vZDQuanBn",  "url" : "https://web.facebook.com/share/p/1DZBvWT3ao/",  "post_by" : "มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 27 ก.ย. 2569" },{ "id" : "35", "title" : "ประกาศมหาวิทยาลัยเกษตรศาสตร์ ฉบับที่ 3 เรื่อง การปฏิบัติงานของบุคลากรมหาวิทยาลัยเกษตรศาสตร์ บางเขน ในสถานการณ์น้ำท่วม ประกาศ ณ วันที่ 26 กันยายน 2569", "detail" : "ฉบับที่ 3 เรื่อง การปฏิบัติงานของบุคลากรมหาวิทยาลัยเกษตรศาสตร์ บางเขน ในสถานการณ์น้ำท่วม ประกาศ ณ วันที่ 26 กันยายน 2569", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wOS0yNl9mbG9vZDMuanBn",  "url" : "https://www.facebook.com/share/p/1MF52GyZ2n/",  "post_by" : "มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 26 ก.ย. 2569" },{ "id" : "34", "title" : "ประกาศมหาวิทยาลัยเกษตรศาสตร์ ฉบับที่ 2 เรื่อง การขยายระยะเวลาการจัดการเรียนการสอนในรูปแบบออนไลน์ เนื่องจากสถานการณ์น้ำท่วม ประกาศ ณ วันที่ 26 กันยายน 2569", "detail" : "ฉบับที่ 2 เรื่อง การขยายระยะเวลาการจัดการเรียนการสอนในรูปแบบออนไลน์ เนื่องจากสถานการณ์น้ำท่วม ประกาศ ณ วันที่ 26 กันยายน 2569", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wOS0yNl9mbG9vZDIuanBn",  "url" : "https://www.facebook.com/share/1JwJXRtgxE/",  "post_by" : "มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 26 ก.ย. 2569" },{ "id" : "33", "title" : "ประกาศมหาวิทยาลัยเกษตรศาสตร์ จากสถานการณ์ฝกตกต่อเนื่องและมีน้ำท่วมขังหลายจุดในกรุงเทพและปริมณฑล ประกาศ ณ วันที่ 26 กันยายน 2569", "detail" : "จากสถานการณ์ฝกตกต่อเนื่องและมีน้ำท่วมขังหลายจุดในกรุงเทพและปริมณฑล ประกาศ ณ วันที่ 26 กันยายน 2569", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wOS0yNl9mbG9vZC5qcGc=",  "url" : "https://www.facebook.com/share/p/1JfDtdfuA2/?mibextid=wwXIfr",  "post_by" : "มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 26 ก.ย. 2569" },{ "id" : "32", "title" : "เปิดรับสมัครเข้าร่วมโครงการ Business Brotherhood ประจำปี 2570", "detail" : "สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม เปิดรับข้อเสนอโครงการ Business Brotherhood ประจำปี 2570 พัฒนา Startup ด้วยความร่วมมือระหว่างกิจการขนาดใหญ่ mentor และมหาวิทยาลัย ทุนสนับสนุนสูงสุด 200,000 บาทต่อราย คุณสมบัติ นิสิตนักศึกษาจบแล้วไม่เกิน 5 ปี ผู้ปรกอบการต้องมีนิสิตนักศึกษาในทีมไม่น้อยกว่ากึ่งหนึ่ง ต้องมี Prototype หรือ MVP เบื้องต้น กลุ่มเทคโนโลยี อาหารและเกษตร สุขภาพและแพทย์ Digital การพัฒนาชุมชนและสังคมอย่างยั่งยืน เงื่อนไขตามข้อกำหนดในข้อเสนอโครงการ ปิดรับข้อเสนอโครงการ วันที่ 31 สิงหาคม 2569 สอบถามเพิ่มเติมได้ที่ สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม มหาวิทยาลัยเกษตรศาสตร์ ส่งใบสมัคร คลิกข้อมูลเพิ่มเติมด้านล่าง", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wOF9icm90aGVyaG9vZC5qcGc=",  "url" : "https://kasets.art/IN9v0Z",  "post_by" : "สำนักงานนวัตกรรมและพันธกิจเพื่อสังคม มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 14 ส.ค. 2569" },{ "id" : "31", "title" : "ขอเชิญอาจารย์ นิสิต และบุคลากรมหาลัยเกษตรศาสตร์ บางเขน ทุกท่าน ร่วมทำบุญตักบาตร Freshy KU86 พระสงฆ์ 86 รูป", "detail" : "ขอเชิญอาจารย์ นิสิต และบุคลากรมหาลัยเกษตรศาสตร์ บางเขน ทุกท่าน ร่วมทำบุญตักบาตรข้าวสารอาหารแห้ง พระสงฆ์ 86 รูป ในวันอาทิตย์ที่ 26 กรกฎาคม 2569 เวลา 07.00-08.30 น. ณ หน้าหอประชุมใหญ่ มหาวิทยาลัยเกษตรศาสตร์ บางเขน ภายในงานมีจำหน่ายชุดตักบาตรชุดละ 60 บาท นิสิตที่เข้าร่วมกิจกรรมจะได้รับชั่วโมงกิจกรรมด้านคุณธรรม จริยธรรม 4 ชั่วโมง ติดต่อสอบถามเพิ่มเติม 0644218816, 0983626463 ลงทะเบียนเข้าร่วมกิจกรรมคลิกที่ข้อมูลเพิ่มเติมด้านล่าง", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wN19tYWtyLW1lcml0LmpwZw==",  "url" : "https://www.ibsclub.net/ibsclub/apply_camp/form.php?a=693723028",  "post_by" : "ชมรมพุทธศาสน์ มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 23 ก.ค. 2569" },{ "id" : "30", "title" : "Welcome KU86", "detail" : "จัดทำโดย งานสื่อสารองค์กร มหาวิทยาลัยเกษตรศาสตร์", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wNl93ZWxjb21lX2t1ODYuanBlZw==",  "url" : "https://www.facebook.com/KasetsartUniversity",  "post_by" : "มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 22 มิ.ย. 2569" },{ "id" : "29", "title" : "เชิญชวนนิสิตทุกท่านร่วมสะท้อนความรู้สึกต่อการดำเนินงานของมหาวิทยาลัย เพื่อ KU ที่ดีขึ้นของเรา", "detail" : "มหาวิทยาลัยเกษตรศาสตร์ ขอความร่วมมือจากนิสิตทุกท่านในการตอบแบบสอบถามประเด็นต่าง ๆ ที่ เกี่ยวข้องกับมหาวิทยาลัย ผลการศึกษาจะนำไปใช้เป็นตัวชี้วัดด้านคุณภาพ และพัฒนาการดำเนินงานของมหาวิทยาลัย ตลอดจนใช้เป็นข้อมูลประกอบการจัดทำรายงานการประกันคุณภาพภายในของมหาวิทยาลัย และการประกันคุณภาพการศึกษาระดับหลักสูตร การวิเคราะห์ข้อมูลจะรายงานในภาพรวมของมหาวิทยาลัยเท่านั้น โดยไม่ก่อให้เกิดผลกระทบต่อสิทธิ ข้อมูลส่วนบุคคล หรือสถานะของนิสิตแต่ละรายแต่อย่างใด สำหรับนิสิต ป.ตรี ที่บันทึกข้อมูล จะนับเป็นการเข้าร่วมกิจกรรมเสริมหลักสูตรในโครงการด้านการคิดและการเรียนรู้ ร่วมตอบแบบสอบถามคลิก ข้อมูลเพิ่มเติม ด้านล่าง", "icon" : "https://kuappstore.ku.ac.th/nisitku/news/images.php",  "photo" : "https://kuappstore.ku.ac.th/nisitku/news/images.php?img=LyEjMzI1NjkvMjU2OS0wM19zdXJ2ZXkuanBn",  "url" : "https://eassess.ku.ac.th/AssessKU-V3/",  "post_by" : "กองบริหารยุทธศาสตร์ มหาวิทยาลัยเกษตรศาสตร์",  "post_date" : "โพสต์เมื่อ : 6 มี.ค. 2569" }]};
    var GENUINE_NEWS_HILIGHT = [{"status" : "true", "news" : [{ "id" : "1", "title" : "กฐิน 69", "detail" : "", "url" : "https://www.ku.ac.th/th/news1/view/%E0%B8%9E%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%96%E0%B8%A7%E0%B8%B2%E0%B8%A2%E0%B8%9C%E0%B9%89%E0%B8%B2%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%90%E0%B8%B4%E0%B8%99%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%97%E0%B8%B2%E0%B8%99-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%B3%E0%B8%9B%E0%B8%B5-%E0%B8%9E-%E0%B8%A8-2569", "date" : "3 November 2026", "photo" : "https://www.ku.ac.th/web-upload/202611/m_banner/23/img_2ce8d82a59e75a53e36635e9cda2f964.jpg" },{ "id" : "2", "title" : "Openhouse 69", "detail" : "", "url" : "https://www.ku.ac.th/th/news1/view/KU-Open-House-2026-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%99%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A1%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88-29", "date" : "30 October 2026", "photo" : "https://www.ku.ac.th/web-upload/202610/m_banner/23/img_a88ada2463f880047b960a76ff100065.jpg" },{ "id" : "3", "title" : "ดาวน์โหลดตราสัญลักษณ์ 84 ปี", "detail" : "", "url" : "https://www.ku.ac.th/th/news1/view/%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%8D%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%93%E0%B9%8C-%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%89%E0%B8%A5%E0%B8%B4%E0%B8%A1%E0%B8%89%E0%B8%A5%E0%B8%AD%E0%B8%87-84-%E0%B8%9B%E0%B8%B5-%E0%B9%81%E0%B8%AB%E0%B9%88%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%9B%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C", "date" : "15 October 2026", "photo" : "https://www.ku.ac.th/web-upload/202610/m_banner/23/img_08683c80abef2867a66d4ffef5b5aebd.jpg" },{ "id" : "4", "title" : "การประชุมทางวิชาการครั้งที่ 65", "detail" : "", "url" : "https://annualconference.ku.ac.th/", "date" : "6 October 2026", "photo" : "https://www.ku.ac.th/web-upload/202610/m_banner/23/img_51e41c91572efeea329b94c168f8b5f3.jpg" },{ "id" : "5", "title" : "TH-AI", "detail" : "", "url" : "https://de.aipass.net/", "date" : "8 September 2026", "photo" : "https://www.ku.ac.th/web-upload/202609/m_banner/23/img_f74ae333ac6e282d942aeb450e541312.jpg" },{ "id" : "6", "title" : "icdef2027", "detail" : "", "url" : "https://icdef2027.org/", "date" : "15 September 2026", "photo" : "https://www.ku.ac.th/web-upload/202609/m_banner/23/img_396447c89fc20913e26a71a0e29742d0.jpg" },{ "id" : "7", "title" : "องค์ภา", "detail" : "", "url" : "https://www.ku.ac.th/th/", "date" : "12 June 2026", "photo" : "https://www.ku.ac.th/web-upload/202606/m_banner/23/img_dd45cdabce17e9161cd935b8ae6a53f1.jpg" },{ "id" : "8", "title" : "green68", "detail" : "", "url" : "https://www.ku.ac.th/th/news1/view/%E0%B8%A1%E0%B8%81-%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B8%9B%E0%B9%8C%E0%B8%AD%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B1%E0%B8%9A-1-%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%97%E0%B8%A8%E0%B9%84%E0%B8%97%E0%B8%A2-5-%E0%B8%9B%E0%B8%B5-%E0%B8%8B%E0%B9%89%E0%B8%AD%E0%B8%99-%E0%B8%95%E0%B8%B4%E0%B8%94%E0%B8%AD%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B1%E0%B8%9A-22-%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%82%E0%B8%A5%E0%B8%81-%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%B5-2025", "date" : "8 December 2025", "photo" : "https://www.ku.ac.th/web-upload/202512/m_banner/23/img_e055b71b8f58941f699e6b864a5da1d5.jpg" },{ "id" : "9", "title" : "บริจาคสร้าง รพ.มก. ลดหย่อนภาษี 1 เท่า", "detail" : "", "url" : "https://www.ku.ac.th/th/news1/view/%E0%B8%82%E0%B8%AD%E0%B9%80%E0%B8%8A%E0%B8%B4%E0%B8%8D%E0%B8%A3%E0%B9%88%E0%B8%A7%E0%B8%A1%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%88%E0%B8%B2%E0%B8%84%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AD%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3-%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-%E0%B8%82%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%A7%E0%B8%A5%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B9%82%E0%B8%A2%E0%B8%8A%E0%B8%99%E0%B9%8C%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5-2-%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2", "date" : "13 February 2026", "photo" : "https://www.ku.ac.th/web-upload/202602/m_banner/23/img_ce8c68f36014d4cea2c701fbdd361276.jpg" },{ "id" : "10", "title" : "แนะแนวหลักสูตร 2568", "detail" : "", "url" : "https://www.ku.ac.th/th/education-news/view/%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B9%81%E0%B8%99%E0%B8%A7%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C-2568", "date" : "9 June 2025", "photo" : "https://www.ku.ac.th/web-upload/202506/m_banner/23/img_55c41959a45e06b1ffaf27746d7a43d1.jpg" },{ "id" : "11", "title" : "kumooc", "detail" : "", "url" : "https://www.ku.ac.th/th/meeting-seminar-training-news/view/%E0%B8%A1-%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3-%E0%B9%80%E0%B8%9B%E0%B8%B4%E0%B8%94%E0%B8%95%E0%B8%B1%E0%B8%A7-25-%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2-%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%8A%E0%B8%99%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%95%E0%B8%A5%E0%B8%AD%E0%B8%94%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95", "date" : "24 February 2025", "photo" : "https://www.ku.ac.th/web-upload/202504/m_banner/23/img_f748d1ba053acbb2d9b403d24fdd07f6.jpg" },{ "id" : "12", "title" : "Nondegree วิทยาลัยบูรณาการศาสตร์", "detail" : "", "url" : "https://sis.ku.ac.th/coursenondegree/", "date" : "23 January 2024", "photo" : "https://www.ku.ac.th/web-upload/202401/m_banner/23/img_1e5351f87a8e2a33d8103a08bb74d30a.jpg" },{ "id" : "13", "title" : "International College", "detail" : "", "url" : "https://kuic.ku.ac.th/", "date" : "28 June 2023", "photo" : "https://www.ku.ac.th/web-upload/202306/m_banner/23/img_7ae08160434670e3318a04e53d25745b.jpg" }]}];
    var GENUINE_LINKS = [{"status" : "true", "link" : [{ "id" : "1", "title" : "เว็บมหาวิทยาลัย", "title_en" : "", "url" : "http://www.ku.ac.th", "photo" : "" },{ "id" : "2", "title" : "ระบบสารสนเทศนิสิต", "title_en" : "", "url" : "http://www.regis.ku.ac.th", "photo" : "" },{ "id" : "3", "title" : "ระบบลงทะเบียนนิสิตโครงการภาคพิเศษ", "title_en" : "", "url" : "https://sp-regis.ku.ac.th", "photo" : "" },{ "id" : "4", "title" : "ระเบียนประวัติและแบบสำรวจนิสิตใหม่", "title_en" : "", "url" : "https://student.ku.ac.th/newregis/", "photo" : "" },{ "id" : "5", "title" : "ระบบประเมินการเรียนการสอน", "title_en" : "", "url" : "https://eassess.ku.ac.th", "photo" : "" },{ "id" : "6", "title" : "ฟาร์ม(เรียน)รู้ มก. eduFarm - KU Learning Farm", "title_en" : "", "url" : "https://lms.ku.ac.th", "photo" : "" },{ "id" : "8", "title" : "จดหมายอิเล็กทรอนิกส์ KU Webmail", "title_en" : "", "url" : "http://webmail.ku.ac.th", "photo" : "" },{ "id" : "9", "title" : "ระบบกู้คืนรหัสผ่าน (Account Nontri)", "title_en" : "", "url" : "https://accounts.ku.ac.th/", "photo" : "" },{ "id" : "10", "title" : "บริการบัญชี KU-Google", "title_en" : "", "url" : "https://accounts.ku.ac.th/kgg/", "photo" : "" },{ "id" : "12", "title" : "วีดิทัศน์แนะนำมหาวิทยาลัยเกษตรศาสตร์", "title_en" : "", "url" : "https://iad.intaff.ku.ac.th/portal/iad/multimedia.php", "photo" : "" }]}];

    // 3. AngularJS HTTP Interceptor
    angular.module("starter")
        .config(["$httpProvider", function ($httpProvider) {
            $httpProvider.interceptors.push(["$q", function ($q) {
                return {
                    request: function (config) {
                        var url = config.url || "";

                        // Allow local HTML templates, CSS, JS, and images to load normally
                        if (
                            url.indexOf(".html") !== -1 ||
                            url.indexOf(".css") !== -1 ||
                            url.indexOf(".js") !== -1 ||
                            url.indexOf(".png") !== -1 ||
                            url.indexOf(".jpg") !== -1 ||
                            url.indexOf(".jpeg") !== -1 ||
                            url.indexOf(".svg") !== -1 ||
                            url.indexOf(".ttf") !== -1 ||
                            url.indexOf(".woff") !== -1
                        ) {
                            return config;
                        }

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
                                id: localStorage.getItem("id") || "6820105843",
                                token: localStorage.getItem("token") || "5QtAdyrAe560867b",
                                name_th: localStorage.getItem("name_th") || "พรเทพ",
                                surname_th: localStorage.getItem("surname_th") || "พุฒอินทร์",
                                name_en: localStorage.getItem("name_en") || "Phonthep PHUTIN",
                                img_profile: localStorage.getItem("imgProfile") || "img/student_photo.jpg"
                            }];
                        }

                        // =====================================
                        // B. Student Profile (v1 & v2.7)
                        // =====================================
                        else if (action === "profile") {
                            var fnTh = localStorage.getItem("name_th") || "พรเทพ";
                            var snTh = localStorage.getItem("surname_th") || "";
                            var fullTh = fnTh;
                            if (snTh && fnTh.indexOf(snTh) === -1) {
                                fullTh = fnTh + " " + snTh;
                            }

                            var fnEn = localStorage.getItem("name_en") || "Phonthep";
                            var snEn = localStorage.getItem("surname_en") || "";
                            var fullEn = fnEn;
                            if (snEn && fnEn.indexOf(snEn) === -1) {
                                fullEn = fnEn + " " + snEn;
                            }

                            mockData = {
                                status: "true",
                                id: localStorage.getItem("id") || "6820105843",
                                name_th: fullTh,
                                name_en: fullEn,
                                student_card: localStorage.getItem("student_card_path") || "img/card_front.png",
                                student_card_b: localStorage.getItem("student_card_b_path") || "img/card_back.png",
                                img_qrcode: localStorage.getItem("barcode_path") || "img/barcode.png",
                                img_barcode: localStorage.getItem("barcode_path") || "img/barcode.png",
                                img_std_qrcode: "img/qrcode.png",
                                img_profile: localStorage.getItem("imgProfile") || "img/student_photo.jpg",
                                faculty: localStorage.getItem("faculty") || "เกษตร กำแพงแสน",
                                major: "นวัตกรรมผลิตภัณฑ์เกษตรและอาหาร",
                                campus: localStorage.getItem("campus") || "กำแพงแสน",
                                degree: "วท.บ. (เกษตรศาสตร์)",
                                std_data: [
                                    { label: "ระดับปริญญา", value: localStorage.getItem("level") || "ปริญญาตรี" },
                                    { label: "คณะ", value: localStorage.getItem("faculty") || "เกษตร กำแพงแสน" },
                                    { label: "วิทยาเขต", value: localStorage.getItem("campus") || "กำแพงแสน" },
                                    { label: "สถานภาพนิสิต", value: localStorage.getItem("std_status") || "กำลังศึกษา" }
                                ],
                                adv_data: [
                                    { label: "ชื่อ-นามสกุล", value: localStorage.getItem("adv_name") || "ไม่มีรหัสอาจารย์ที่ปรึกษา ." },
                                    { label: "อีเมล", value: localStorage.getItem("adv_email") || "-" }
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
                            mockData = GENUINE_GRADE;
                        }

                        // =====================================
                        // D. Class Timetable (cs_time)
                        // =====================================
                        else if (action === "cs_time") {
                            mockData = GENUINE_CSTIME;
                        }

                        // =====================================
                        // E. Registration & RegisInfo
                        // =====================================
                        else if (action === "register") {
                            mockData = GENUINE_REGISTER;
                        } else if (action === "regisinfo") {
                            mockData = GENUINE_REGISINFO;
                        }

                        // =====================================
                        // F. Exam Schedule & Scores
                        // =====================================
                        else if (action === "exam") {
                            mockData = [{ status: "false" }];
                        } else if (action === "score") {
                            mockData = [];
                        }

                        // =====================================
                        // G. KU9 Form
                        // =====================================
                        else if (action === "ku9") {
                            mockData = GENUINE_KU9;
                        }

                        // =====================================
                        // H. Activities (ActReport / Transcript)
                        // =====================================
                        else if (action.indexOf("act") === 0) {
                            if (action === "actcalendar") {
                                mockData = GENUINE_ACTCALENDAR;
                            } else {
                                mockData = GENUINE_ACTREPORT;
                            }
                        }

                        // =====================================
                        // I. Library (KU Lib)
                        // =====================================
                        else if (url.indexOf("kulib") !== -1 || action === "patron" || action === "borrow" || action === "overdue" || action === "readinglog") {
                            mockData = [
                                { status: "true", name: localStorage.getItem("name_th") || "พรเทพ", title: "-", date: "-", fine: "0.00", callno: "-", barcode: "-" }
                            ];
                        }

                        // =====================================
                        // J. Events & Calendar
                        // =====================================
                        else if (url.indexOf("events/Controller.php") !== -1 || action === "event" || action === "events") {
                            mockData = GENUINE_EVENTS;
                        }

                        // =====================================
                        // K. Quick Links
                        // =====================================
                        else if (url.indexOf("link/Controller.php") !== -1) {
                            mockData = GENUINE_LINKS;
                        }

                        // =====================================
                        // L. News & Press Release
                        // =====================================
                        else if (url.indexOf("news/Controller.php") !== -1) {
                            if (action === "news") {
                                mockData = GENUINE_NEWS_PR;
                            } else {
                                mockData = GENUINE_NEWS_HILIGHT;
                            }
                        }
                        else if (action === "news") {
                            mockData = GENUINE_NEWS_PR;
                        }
                        else if (action === "list") {
                            mockData = GENUINE_NEWS_HILIGHT;
                        }
                        else if (url.indexOf("hotnews/api.php") !== -1 || action === "hotnews") {
                            mockData = {
                                status: "true",
                                data: [
                                    { url_img: "https://www.ku.ac.th/web-upload/202611/m_banner/23/img_2ce8d82a59e75a53e36635e9cda2f964.jpg", url_link: "https://www.ku.ac.th/" },
                                    { url_img: "https://www.ku.ac.th/web-upload/202610/m_banner/23/img_a88ada2463f880047b960a76ff100065.jpg", url_link: "https://www.ku.ac.th/" },
                                    { url_img: "https://www.ku.ac.th/web-upload/202610/m_banner/23/img_08683c80abef2867a66d4ffef5b5aebd.jpg", url_link: "https://www.ku.ac.th/" }
                                ]
                            };
                        }
                        else if (action === "banner" || url.indexOf("banner") !== -1) {
                            mockData = GENUINE_NEWS_PR;
                        }

                        // =====================================
                        // K. EULA & Manual
                        // =====================================
                        else if (action === "eula") {
                            mockData = GENUINE_EULA;
                        }
                        else if (action === "getManual") {
                            mockData = GENUINE_MANUAL;
                        }

                        // =====================================
                        // L. Check-in, Vote, Notifications
                        // =====================================
                        else if (url.indexOf("checkin") !== -1 || url.indexOf("vote") !== -1 || url.indexOf("message") !== -1 || action === "message" || action === "logs") {
                            mockData = [
                                { status: "true", title: "ระบบสารสนเทศนิสิต", message: "ยินดีต้อนรับสู่ NisitKU", date: "2026-11-09", name: "NisitKU", logs: [] }
                            ];
                        }

                        // =====================================
                        // M. LOGOUT — clear card and reload
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
                                { status: "true", id: localStorage.getItem("id") || "6820105843", title: "NisitKU", name: "NisitKU", message: "OK", date: "2026-11-09", value: "OK" }
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
