import { IncomingMessage, ServerResponse } from "http";
import { Database } from "../db.js";
import { ENDPOINTS } from "../endpoints.js";

import {
  generateUserId,
  isUserValid,
  User,
  UserId,
  validateUserId,
} from "./user.model.js";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type Resolver = (
  db: Database,
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) => Promise<void>;

const routerUser: Partial<Record<HttpMethod, Resolver>> = {
  [HttpMethod.GET]: async (db, req, res) => getAllUsers(db, req, res),
  [HttpMethod.POST]: async (db, req, res) => createUser(db, req, res),
};

const routerUserWithId: Partial<Record<HttpMethod, Resolver>> = {
  [HttpMethod.GET]: async (db, req, res, userId) => readUser(db, req, res, userId),
  [HttpMethod.PUT]: async (db, req, res, userId) => updateUser(db, req, res, userId),
  [HttpMethod.DELETE]: async (db, req, res, userId) => deleteUser(db, req, res, userId),
};

async function getAllUsers(db: Database, req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(Object.entries(db.users).map(([key, value]) => value)));
}

async function createUser(db: Database, req: IncomingMessage, res: ServerResponse) {
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

async function findUser(
  db: Database,
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

async function readUser(
  db: Database,
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  const user = await findUser(db, req, res, userId);
  if (!user) return;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
}

async function updateUser(
  db: Database,
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  const user = await findUser(db, req, res, userId);
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

async function deleteUser(
  db: Database,
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) {
  const user = await findUser(db, req, res, userId);
  if (!user) return;

  delete db.users[userId];
  res.writeHead(204);
  res.end();
  process.send?.({ task: "sync", data: db });
}

export async function usersController(
  db: Database,
  req: IncomingMessage,
  res: ServerResponse
) {
  const [_, userId] = req.url?.replace(ENDPOINTS.users, "").split("/") || [];

  const resolver = userId
    ? routerUserWithId[req.method as HttpMethod]
    : routerUser[req.method as HttpMethod];

  if (!resolver) {
    new Error("Unexpected input");
    return;
  }
  await resolver(db, req, res, userId);
}

async function parseRequestBody<T>(req: IncomingMessage): Promise<Awaited<T>> {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}
