import { assert, describe, expect, it } from "vitest";
import request from "supertest";
import http from "http";
import { ENDPOINTS } from "./app";

const req = request("http://localhost:8000");

describe("App", () => {
  it("Requests to non-existing endpoints should be handled with 404", async () => {
    await req.get("/api/non-existing-endpoint").expect(404);
  });
});
