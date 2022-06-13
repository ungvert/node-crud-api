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
  // it(`Get all records with a GET api/users`, async () => {
  //   const responce = await req.get(`${ENDPOINTS.users}`).expect(200);
  //   expect(responce.body).toStrictEqual([]);
  // });

  it(`Create, read, update, delete is implemented properly`, async () => {
    // CREATE
    // A new object is created by a POST api/users request
    const newUser: User = {
      username: "Test user",
      age: 42,
      hobbies: ["cooking", "painting", "hiking"],
    };
    const responceAddNew = await req.post(`${ENDPOINTS.users}`).send(newUser).expect(201);
    expect(responceAddNew.body.id).toBeTruthy();
    newUser.id = responceAddNew.body.id;
    expect(responceAddNew.body).toStrictEqual(newUser);

    // READ
    // With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected
    const responceGet = await req.get(`${ENDPOINTS.users}/${newUser.id}`).expect(200);
    expect(responceGet.body).toStrictEqual(newUser);

    // UPDATE
    // We try to update the created record with a PUT api/users/{userId}request
    const updatedUser = {
      id: newUser.id,
      username: "Modified username",
      age: 22,
      hobbies: ["hiking"],
    };
    const responcePut = await req
      .put(`${ENDPOINTS.users}/${updatedUser.id}`)
      .send(updatedUser)
      .expect(200);
    expect(responcePut.body).toStrictEqual(updatedUser);

    // // DELETE
    // // With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)
    // await req.delete(`${ENDPOINTS.users}/${newUser.id}`).expect(204);

    // // READ
    // // With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)
    // await req.get(`${ENDPOINTS.users}/${newUser.id}`).expect(404);
  });

  // it(`GET, PUT api/users/:userId respond with 400 when :userId is not uuid`, async () => {
  //   let responce = await req.get(`${ENDPOINTS.users}/not-valid-uuid`).expect(400);
  //   expect(responce.text).toBe("UserId is not invalid");

  //   responce = await req.put(`${ENDPOINTS.users}/not-valid-uuid`).expect(400);
  //   expect(responce.text).toBe("UserId is not invalid");
  // });

  it.todo("GET api/users/:userId respond with 404 when user is not found");

  it.todo(
    "We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)"
  );

  it.todo(
    "With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)"
  );
});
