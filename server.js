// Startup file cho Phusion Passenger (cPanel Node.js App — Nhân Hòa).
//
// File này là CommonJS (package.json KHÔNG khai báo "type": "module"), vì Passenger
// nạp startup file bằng require(). Nếu để dự án ở chế độ ESM thì require() một
// file .js sẽ ném ERR_REQUIRE_ESM và site không khởi động nổi — lỗi 503 khó đoán.
//
// server.cjs là bản sao y hệt, để dù cPanel đang trỏ vào tên nào cũng chạy được.
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
