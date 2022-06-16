import { Server } from "http";
import requestSupertest from "supertest";
import { createServer } from "../createServer";

let cachedServer: Server;

export const getRequestToTestServer = async () => {
  const testServer = cachedServer ?? (await createServer());
  cachedServer = testServer;

  return requestSupertest(testServer);
};

export const request = await getRequestToTestServer();
