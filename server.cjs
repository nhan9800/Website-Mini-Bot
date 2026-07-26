// Startup file cho Phusion Passenger (cPanel Node.js App — Nhân Hòa).
//
// Vì sao là .cjs chứ không phải .js: package.json khai báo "type": "module", nên
// mọi file .js trong dự án được coi là ESM. Passenger nạp startup file bằng
// require(), mà require() một file ESM thì ném ERR_REQUIRE_ESM trên nhiều bản
// Node — site sẽ không khởi động nổi. Đuôi .cjs buộc file này là CommonJS nên
// require() luôn nạp được, bất kể phiên bản Node của hosting.
//
// Đặt "Application startup file" trong cPanel = server.cjs
const { createServer } = require('node:http');
const next = require('next');

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const hostname = process.env.HOST ?? '0.0.0.0';
const isDev = process.env.NODE_ENV === 'development';

const app = next({ dev: isDev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res).catch((err) => {
        console.error('[MimiWeb Error] Lỗi xử lý request:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
      });
    });

    server.listen(port, () => {
      console.log(`[Mimi Web] Sẵn sàng tại http://${hostname}:${port} (mode: ${isDev ? 'dev' : 'production'})`);
    });
  })
  .catch((err) => {
    console.error('[MimiWeb Fatal] Không thể khởi động ứng dụng Next.js:', err);
    process.exit(1);
  });
