import { IncomingMessage, ServerResponse } from "http";

import { UserId } from "./user.model.js";
import {
  getAllUsers,
  createUser,
  readUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type Resolver = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: UserId
) => Promise<void>;

export const routerUser: Partial<Record<HttpMethod, Resolver>> = {
  [HttpMethod.GET]: async (req, res) => getAllUsers(req, res),
  [HttpMethod.POST]: async (req, res) => createUser(req, res),
};

export const routerUserWithId: Partial<Record<HttpMethod, Resolver>> = {
  [HttpMethod.GET]: async (req, res, userId) => readUser(req, res, userId),
  [HttpMethod.PUT]: async (req, res, userId) => updateUser(req, res, userId),
  [HttpMethod.DELETE]: async (req, res, userId) => deleteUser(req, res, userId),
};
