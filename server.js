import http from "http";
import next from "next";
import { initSocket } from "./src/lib/socket.js";
import dotenv from "dotenv";
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
console.log("NODE_ENV at runtime:", process.env.NODE_ENV);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  initSocket(server);

  server.listen(3000, () => {
    console.log("Server now Running...");
  });
});
