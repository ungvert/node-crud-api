import { assert, describe, expect, it } from "vitest";
import request from "supertest";
import { ENDPOINTS } from "./endpoints";
import { User } from "./user.js";

const req = request("http://localhost:8000");

describe("App", () => {
  it("Requests to non-existing endpoints should be handled with 404 and apropriate message", async () => {
    const responce = await req.get("/api/non-existing-endpoint").expect(404);
    expect(responce.text).toBe("Endpoind not found");
  });
});

describe(ENDPOINTS.users, () => {
  it(`Get all records with a GET api/users`, async () => {
    const responce = await req.get(`${ENDPOINTS.users}`).expect(200);
    expect(responce.body).toStrictEqual([]);
  });

  it(`A new object is created by a POST api/users request`, async () => {
    const responce = await req
      .post(`${ENDPOINTS.users}`)
      .send({
        username: "Test user",
        age: 42,
        hobbies: ["cooking", "painting", "hiking"],
      } as User)
      .expect(201);
    expect(responce.body.id).toBeTruthy();
  });

  it.todo(
    "With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)"
  );

  it.todo(
    "We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)"
  );
  it.todo(
    "With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)"
  );
  it.todo(
    "With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)"
  );
});
