import { describe, expect, it } from "vitest";
import { request } from "./common/testUtils.js";

describe("server", () => {
  it("should handle requests to non-existing endpoints with 404 and apropriate message", async () => {
    const responce = await request.get("/api/non-existing-endpoint").expect(404);
    expect(responce.text).toBe("Endpoind not found");
  });
});
