// Startup file cho Phusion Passenger (cPanel Node.js App — Nhân Hòa) hoặc VPS standalone.
// Passenger sẽ tự động truyền cổng qua process.env.PORT và ứng dụng Next.js listen trên cổng này.
import { createServer } from 'node:http';
import next from 'next';

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
      console.log(`[Mimi Web v2.0] Sẵn sàng tại http://${hostname}:${port} (mode: ${isDev ? 'dev' : 'production'})`);
    });
  })
  .catch((err) => {
    console.error('[MimiWeb Fatal] Không thể khởi động ứng dụng Next.js:', err);
    process.exit(1);
  });
