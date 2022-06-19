import { once } from "events";
import http from "http";
import { pid } from "process";

import { ENDPOINTS } from "./endpoints.js";
import { usersController } from "./users/usersController.js";

export async function createServer() {
  const server = http.createServer(async (req, res) => {
    console.log(pid, req.method, req.url);

    res.setHeader("process-id", process.pid);

    if (!req.url?.startsWith(ENDPOINTS.users)) {
      res.writeHead(404);
      res.end("Endpoind not found");
      return;
    }

    try {
      return await usersController(req, res);
    } catch (error) {
      res.writeHead(500);
      res.end("Server encountered an unexpected error " + JSON.stringify(error));
    }
  });

  return server;
}

export async function startServer(port: number = 8000) {
  const server = await createServer();
  server.listen(port);
  await once(server, "listening");
}
