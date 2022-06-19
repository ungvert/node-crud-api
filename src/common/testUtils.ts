import { Server } from "http";
import requestSupertest from "supertest";
import { db } from "../db.js";
import { createServer } from "../server";

let cachedServer: Server;

export const getRequestToTestServer = async () => {
  const testServer = cachedServer ?? (await createServer(() => db));
  cachedServer = testServer;

  return requestSupertest(testServer);
};

export const request = await getRequestToTestServer();
