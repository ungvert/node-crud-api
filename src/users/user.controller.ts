import { IncomingMessage, ServerResponse } from "http";
import { Database, db } from "../db.js";
import { ENDPOINTS } from "../endpoints.js";

import {
  generateUserId,
  isUserValid,
  User,
  UserId,
  validateUserId,
} from "./user.model.js";
import { routerUserWithId, routerUser, HttpMethod } from "./user.router.js";

export async function usersController(req: IncomingMessage, res: ServerResponse) {
  const [_, userId] = req.url?.replace(ENDPOINTS.users, "").split("/") || [];

  const resolver = userId
    ? routerUserWithId[req.method as HttpMethod]
    : routerUser[req.method as HttpMethod];

  if (!resolver) throw new Error("Route not found");

  await resolver(req, res, userId);
}

export async function getAllUsers(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(Object.entries(db.users).map(([key, value]) => value)));
}

export async function createUser(req: IncomingMessage, res: ServerResponse) {
  const user = await parseRequestBody<User>(req);
  user.id = generateUserId();

  if (!isUserValid(user)) {
    res.writeHead(400);
    res.end("Input is not valid");
    return;
  }
  db.users[user.id] = user;

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));

  process.send?.({ task: "sync", data: db });
}

export async function findUser(
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  if (!validateUserId(userId)) {
    res.writeHead(400);
    res.end("User Id is not valid");
    return;
  }

  const user = db.users[userId];
  if (!user) {
    res.writeHead(404);
    res.end(`User with Id ${userId} doesn't exist`);
    return;
  }

  return user;
}

export async function readUser(
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  const user = await findUser(req, res, userId);
  if (!user) return;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
}

export async function updateUser(
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  const user = await findUser(req, res, userId);
  if (!user) return;

  const userUpdated = await parseRequestBody<User>(req);
  if (!isUserValid(userUpdated)) {
    res.writeHead(400);
    res.end("Input is not valid");
    return;
  }
  db.users[userId] = userUpdated;

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(userUpdated));
  process.send?.({ task: "sync", data: db });
}

export async function deleteUser(
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  const user = await findUser(req, res, userId);
  if (!user) return;

  delete db.users[userId];
  res.writeHead(204);
  res.end();
  process.send?.({ task: "sync", data: db });
}

export async function parseRequestBody<T>(req: IncomingMessage): Promise<Awaited<T>> {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}
