import { describe, expect, it } from "vitest";
import { request } from "./common/testUtils.js";

describe("App", () => {
  it("Requests to non-existing endpoints should be handled with 404 and apropriate message", async () => {
    const responce = await request.get("/api/non-existing-endpoint").expect(404);
    expect(responce.text).toBe("Endpoind not found");
  });
});
