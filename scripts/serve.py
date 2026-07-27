import http.server
import socketserver
import os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT = 8811
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    httpd.serve_forever()
