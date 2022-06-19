import supertest from "supertest";

import { createServer } from "../server";

const testServer = await createServer();

export const request = supertest(testServer);
