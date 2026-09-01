const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf'
};

http.createServer((req, res) => {
  try {
    let requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (requestPath === '/' || requestPath === '') requestPath = '/index.html';

    const file = path.resolve(root, '.' + requestPath);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, 'index.html')) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(file).pipe(res);
  } catch (error) {
    res.writeHead(500);
    res.end('Server error');
  }
}).listen(5173, () => {
  console.log('Portfolio running at http://localhost:5173');
});
