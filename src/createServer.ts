import http from "http";

import { ENDPOINTS } from "./endpoints.js";
import { usersController } from "./users/usersController.js";

export async function createServer() {
  const server = http.createServer(async (req, res) => {
    console.log("req", req.url, req.method);

    if (!req.url?.startsWith(ENDPOINTS.users)) {
      res.writeHead(404);
      res.end("Endpoind not found");
      return;
    }

    try {
      return await usersController(req, res);
    } catch (error) {
      res.writeHead(500);
      res.end("Server encountered an unexpected error");
    }
  });

  return server;
}
