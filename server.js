// server.js
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const host = "0.0.0.0";

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, host, () => {
    console.log(`> Ready on http://${host}:${port}`);
  });
});
