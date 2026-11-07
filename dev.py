"""Local server matching the isolated /gilsalgados path on Vercel."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent / 'site'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/':
            self.send_response(302)
            self.send_header('Location', '/gilsalgados/')
            self.end_headers()
            return
        if path == '/gilsalgados':
            self.path = '/index.html'
        elif path.startswith('/gilsalgados/'):
            self.path = path[len('/gilsalgados'):]
        else:
            self.send_error(404)
            return
        super().do_GET()

if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', 3000), Handler).serve_forever()
