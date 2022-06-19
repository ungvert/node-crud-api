import { once } from "events";
import http from "http";
import { pid } from "process";
import { GetDb } from "./db.js";

import { ENDPOINTS } from "./endpoints.js";
import { usersController } from "./users/usersController.js";

export async function createServer(getDb: GetDb) {
  const server = http.createServer(async (req, res) => {
    console.log(pid, req.method, req.url);

    res.setHeader("process-id", process.pid);

    if (!req.url?.startsWith(ENDPOINTS.users)) {
      res.writeHead(404);
      res.end("Endpoind not found");
      return;
    }

    const db = getDb();
    try {
      return await usersController(db, req, res);
    } catch (error) {
      res.writeHead(500);
      res.end("Server encountered an unexpected error " + JSON.stringify(error));
    }
  });

  return server;
}

export async function startServer(port: number = 8000, getDb: GetDb) {
  const server = await createServer(getDb);
  server.listen(port);
  await once(server, "listening");
}
