import { IncomingMessage, ServerResponse } from "http";
import { v4, validate } from "uuid";
import { ENDPOINTS } from "../endpoints.js";

import { User, UserId } from "./user.js";

const users: Record<UserId, User> = {};

export async function usersController(req: IncomingMessage, res: ServerResponse) {
  const [_, userId] = req.url?.replace(ENDPOINTS.users, "").split("/") || [];

  if (req.method === "GET") {
    if (!userId) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(Object.entries(users).map(([key, value]) => value)));
      return;
    }

    if (!validate(userId)) {
      res.writeHead(400);
      res.end("User Id is not valid");
      return;
    }

    const user = users[userId];
    if (!user) {
      res.writeHead(404);
      res.end(`User with Id ${userId} doesn't exist`);
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  if (req.method === "PUT") {
    if (!userId || !validate(userId)) {
      res.writeHead(400);
      res.end("User Id is not valid");
      return;
    }

    const user = users[userId];
    if (!user) {
      res.writeHead(404);
      res.end(`User with Id ${userId} doesn't exist`);
      return;
    }

    const userUpdated = await parseRequestBody<User>(req);
    // TODO: validate
    users[userId] = userUpdated;

    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(userUpdated));
    return;
  }

  if (req.method === "POST") {
    const user = await parseRequestBody<User>(req);
    user.id = v4();
    // TODO: validate
    users[user.id] = user;

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
    return;
  }

  if (req.method === "DELETE") {
    if (!userId || !validate(userId)) {
      res.writeHead(400);
      res.end("User Id is not valid");
      return;
    }

    const user = users[userId];
    if (!user) {
      res.writeHead(404);
      res.end(`User with Id ${userId} doesn't exist`);
      return;
    }

    delete users[userId];
    res.writeHead(204);
    res.end();
    return;
  }

  throw new Error("Unexpected input");
}

async function parseRequestBody<T>(req: IncomingMessage): Promise<Awaited<T>> {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}
