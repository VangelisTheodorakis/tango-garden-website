#!/usr/bin/env python3
"""Local dev server for Tango Garden static site. Sends no-cache headers so
file changes are always reflected without a hard-refresh."""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3001
DIR  = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # quiet

print(f"Tango Garden dev server: http://localhost:{PORT}/")
http.server.HTTPServer(("", PORT), NoCacheHandler).serve_forever()
