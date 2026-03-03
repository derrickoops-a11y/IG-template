import http.server
import socketserver
import json
import os
import base64
import mimetypes
import re
from urllib.parse import urlparse

PORT = 3001

# Constants for default paths (User-specified)
DEFAULT_CAROUSEL_FOLDER = r"C:\Users\fawazishola\Downloads\DUMP Pre DUC-20260303T120159Z-3-001\DUMP Pre DUC"
DEFAULT_AVATAR_PATH = r"C:\Users\fawazishola\Downloads\IMG-20250527-WA0002(1).jpg"

def get_base64_image(filepath):
    """Reads a file and returns its Base64 data URL string."""
    try:
        if not os.path.exists(filepath):
            return None
        
        mime_type, _ = mimetypes.guess_type(filepath)
        if not mime_type:
            mime_type = 'image/jpeg'
            
        with open(filepath, "rb") as img_file:
            b64_string = base64.b64encode(img_file.read()).decode('utf-8')
            return f"data:{mime_type};base64,{b64_string}"
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

class APIHandler(http.server.SimpleHTTPRequestHandler):
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/defaults':
            # Build payload
            payload = {
                "avatar": "",
                "carousel": []
            }
            
            # 1. Fetch Default Avatar
            if os.path.exists(DEFAULT_AVATAR_PATH):
                avatar_data = get_base64_image(DEFAULT_AVATAR_PATH)
                if avatar_data:
                    payload["avatar"] = avatar_data
                
            # 2. Fetch Carousel Images from Folder
            if os.path.exists(DEFAULT_CAROUSEL_FOLDER) and os.path.isdir(DEFAULT_CAROUSEL_FOLDER):
                # Retrieve standard images only
                files = [f for f in os.listdir(DEFAULT_CAROUSEL_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))]
                # Sort to ensure correct sequential order (natural sort)
                def natural_sort_key(s):
                    return [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', s)]
                
                files.sort(key=natural_sort_key)
                
                for filename in files:
                    full_path = os.path.join(DEFAULT_CAROUSEL_FOLDER, filename)
                    b64_data = get_base64_image(full_path)
                    if b64_data:
                        payload["carousel"].append({
                            "dataUrl": b64_data,
                            "filename": filename
                        })
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return
            
        # Fallback to standard file serving (serving index.html, style.css, script.js)
        return super().do_GET()

with socketserver.TCPServer(("", PORT), APIHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
