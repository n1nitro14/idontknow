import http.server
import socketserver
import os
import io
import urllib.parse
import sys
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from card_generator import generate_student_card, generate_barcode

PORT = int(os.environ.get("PORT", 3000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        # Dynamic Card Generation endpoint
        if parsed.path == "/api/card_front.jpg":
            id_card = params.get("idcard", ["6896341736"])[0]
            name_th = params.get("namethai", ["ธนภัทร\nยิ่งคงพัฒนา"])[0]
            name_en = params.get("nameen", ["Thanapat\nYingkhongphattana"])[0]
            service = params.get("service", ["Management\nSciences"])[0]
            photo_file = params.get("imgprofile", [None])[0]

            photo_path = None
            if photo_file:
                cand = os.path.join(DIRECTORY, "img", os.path.basename(photo_file))
                if os.path.exists(cand):
                    photo_path = cand

            card_img = generate_student_card(
                id_card=id_card,
                name_th=name_th,
                name_en=name_en,
                service=service,
                photo_path=photo_path
            )

            buf = io.BytesIO()
            card_img.save(buf, format="JPEG", quality=95)
            data = buf.getvalue()

            self.send_response(200)
            self.send_header("Content-Type", "image/jpeg")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(data)
            return

        # Dynamic Barcode endpoint
        elif parsed.path == "/api/barcode.png":
            content = params.get("content", ["6896341736"])[0]
            bar_img = generate_barcode(content=content)

            buf = io.BytesIO()
            bar_img.save(buf, format="PNG")
            data = buf.getvalue()

            self.send_response(200)
            self.send_header("Content-Type", "image/png")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(data)
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/save_card":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            try:
                import json, base64
                data = json.loads(body)
                slug = str(data.get("cardSlug", "card")).strip().lower().replace(" ", "_")
                if not slug:
                    slug = "card"

                id_card = str(data.get("idCard", "6896341736")).strip()
                name_th = str(data.get("nameTh", "NOTEXT")).strip()
                name_en = str(data.get("nameEn", "NOTEXT")).strip()
                service = str(data.get("service", "Management\nSciences")).strip()
                barcode_num = str(data.get("barcode", id_card)).strip()
                photo_b64 = data.get("photoBase64", None)

                cards_dir = os.path.join(DIRECTORY, "cards")
                os.makedirs(cards_dir, exist_ok=True)

                photo_path = None
                if photo_b64 and "base64," in photo_b64:
                    photo_raw = base64.b64decode(photo_b64.split("base64,")[1])
                    photo_path = os.path.join(DIRECTORY, "img", f"{slug}_photo.jpg")
                    with open(photo_path, "wb") as pf:
                        pf.write(photo_raw)
                elif data.get("photoFile"):
                    cand = os.path.join(DIRECTORY, "img", os.path.basename(data.get("photoFile")))
                    if os.path.exists(cand):
                        photo_path = cand

                # 1. Render Card
                out_card_path = os.path.join(cards_dir, f"{slug}.jpg")
                generate_student_card(
                    id_card=id_card,
                    name_th=name_th,
                    name_en=name_en,
                    service=service,
                    photo_path=photo_path,
                    output_path=out_card_path
                )

                # 2. Render Barcode
                out_bar_path = os.path.join(cards_dir, f"{slug}_barcode.png")
                generate_barcode(content=barcode_num, output_path=out_bar_path)

                # 3. Write JSON
                first_name_en = name_en.split("\n")[0].split(" ")[0].strip()
                first_name_th = name_th.split("\n")[0].split(" ")[0].strip()
                card_meta = {
                    "nameEn": first_name_en,
                    "nameEnFull": name_en.replace("\n", " "),
                    "nameTh": first_name_th,
                    "nameThFull": name_th.replace("\n", " "),
                    "id": id_card,
                    "cardImg": f"cards/{slug}.jpg",
                    "cardImgBack": "img/b_bc.png",
                    "barcodeImg": f"cards/{slug}_barcode.png",
                    "imgProfile": f"img/{slug}_photo.jpg" if photo_path else "img/71E92FFB-338F-493A-AEB1-77DDDC83F62F.jpeg",
                    "barcode": barcode_num
                }

                with open(os.path.join(cards_dir, f"{slug}.json"), "w", encoding="utf-8") as jf:
                    json.dump(card_meta, jf, ensure_ascii=False, indent=2)

                resp_bytes = json.dumps({
                    "status": "ok",
                    "slug": slug,
                    "appUrl": f"/index.html?card={slug}#/nisit/card",
                    "cardImgUrl": f"/cards/{slug}.jpg"
                }).encode("utf-8")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(resp_bytes)))
                self.end_headers()
                self.wfile.write(resp_bytes)
                return

            except Exception as e:
                err_bytes = json.dumps({"status": "error", "message": str(e)}).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(err_bytes)))
                self.end_headers()
                self.wfile.write(err_bytes)
                return

        self.send_response(404)
        self.end_headers()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def kill_process_on_port(port):
    try:
        cmd = f"netstat -ano | findstr :{port}"
        out = subprocess.check_output(cmd, shell=True).decode()
        for line in out.strip().split("\n"):
            parts = line.split()
            if len(parts) >= 5 and "LISTENING" in line:
                pid = parts[-1]
                if pid != str(os.getpid()):
                    subprocess.call(f"taskkill /F /PID {pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        pass

if __name__ == "__main__":
    # Only kill port when running locally (not on Render)
    is_render = os.environ.get("RENDER", False)
    if not is_render:
        kill_process_on_port(PORT)
    
    print(f"[*] NisitKU Server starting on port {PORT}")
    
    server = ThreadedHTTPServer(("0.0.0.0", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")
