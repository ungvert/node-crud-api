import http from "http";
import { User } from "./user";

const users: User[] = [];

export const ENDPOINTS = {
  users: "/api/users",
};

function usersController(req: http.IncomingMessage, res: http.ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
}
const server = http.createServer((req, res) => {
  if (req.url?.startsWith(ENDPOINTS.users)) {
    return usersController(req, res);
  } else {
    res.writeHead(404);
    res.end("Wrong path");
  }
});

server.listen(8000);
