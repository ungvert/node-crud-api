import { IncomingMessage, ServerResponse } from "http";
import { User } from "./user.js";
import { v4 } from "uuid";

const users: User[] = [];

export async function usersController(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
    return;
  }

  if (req.method === "POST") {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const user = JSON.parse(Buffer.concat(buffers).toString()) as User;
    user.id = v4();

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  throw new Error("Unexpected input");
}
