import { IncomingMessage, ServerResponse } from "http";
import { ENDPOINTS } from "../endpoints.js";

import { generateUserId, User, UserId, validateUserId } from "./user.js";

const users: Record<UserId, User> = {};

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

const routerUser: Partial<
  Record<HttpMethod, (req: IncomingMessage, res: ServerResponse) => Promise<void>>
> = {
  [HttpMethod.GET]: async (req, res) => getAllUsers(req, res),
  [HttpMethod.POST]: async (req, res) => createUser(req, res),
};

type Resolver = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) => Promise<void>;

const routerUserWithId: Partial<Record<HttpMethod, Resolver>> = {
  [HttpMethod.GET]: async (req, res, userId) => readUser(req, res, userId),
  [HttpMethod.PUT]: async (req, res, userId) => updateUser(req, res, userId),
  [HttpMethod.DELETE]: async (req, res, userId) => deleteUser(req, res, userId),
};

function isUserValid(user: unknown): user is User {
  if (!user || typeof user !== "object") return false;

  const age = (user as User).age;
  if (!age || typeof age !== "number") return false;

  const username = (user as User).username;
  if (!username || typeof username !== "string") return false;

  const hobbies = (user as User).hobbies;
  if (!Array.isArray(hobbies) || hobbies.some((item) => typeof item !== "string"))
    return false;

  return true;
}

async function getAllUsers(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(Object.entries(users).map(([key, value]) => value)));
}

async function createUser(req: IncomingMessage, res: ServerResponse) {
  const user = await parseRequestBody<User>(req);
  user.id = generateUserId();

  if (!isUserValid(user)) {
    res.writeHead(400);
    res.end("Input is not valid");
    return;
  }
  users[user.id] = user;

  res.writeHead(201, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
}

async function findUser(req: IncomingMessage, res: ServerResponse, userId: UserId) {
  if (!validateUserId(userId)) {
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

  return user;
}

async function readUser(req: IncomingMessage, res: ServerResponse, userId: UserId) {
  const user = await findUser(req, res, userId);
  if (!user) return;
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(user));
}

async function updateUser(req: IncomingMessage, res: ServerResponse, userId: UserId) {
  const user = await findUser(req, res, userId);
  if (!user) return;

  const userUpdated = await parseRequestBody<User>(req);
  if (!isUserValid(userUpdated)) {
    res.writeHead(400);
    res.end("Input is not valid");
    return;
  }
  users[userId] = userUpdated;

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(userUpdated));
}

async function deleteUser(req: IncomingMessage, res: ServerResponse, userId: UserId) {
  const user = await findUser(req, res, userId);
  if (!user) return;

  delete users[userId];
  res.writeHead(204);
  res.end();
}

export async function usersController(req: IncomingMessage, res: ServerResponse) {
  const [_, userId] = req.url?.replace(ENDPOINTS.users, "").split("/") || [];

  const resolver = userId
    ? routerUserWithId[req.method as HttpMethod]
    : routerUser[req.method as HttpMethod];

  if (!resolver) {
    new Error("Unexpected input");
    return;
  }
  await resolver(req, res, userId);
}

async function parseRequestBody<T>(req: IncomingMessage): Promise<Awaited<T>> {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}
