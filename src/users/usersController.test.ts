import { describe, expect, it } from "vitest";

import { ENDPOINTS } from "../endpoints.js";
import { User } from "./user.js";
import { request } from "../common/testUtils.js";

describe(`Users`, () => {
  describe(`scenario 1`, () => {
    // This operations can't be separated to multiple test - order of operations matters
    it(`should create, read, update, delete users`, async () => {
      // Get all records with a GET api/users
      const responce = await request.get(ENDPOINTS.users).expect(200);
      expect(responce.body).toStrictEqual([]);

      // A new object is created by a POST api/users request
      const newUser: User = {
        username: "Test user",
        age: 42,
        hobbies: ["cooking", "painting", "hiking"],
      };
      const responceAddNew = await request
        .post(`${ENDPOINTS.users}`)
        .send(newUser)
        .expect(201);
      expect(responceAddNew.body.id).toBeTruthy();
      newUser.id = responceAddNew.body.id;
      expect(responceAddNew.body).toStrictEqual(newUser);

      // READ
      // With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected
      const responceGet = await request
        .get(`${ENDPOINTS.users}/${newUser.id}`)
        .expect(200);
      expect(responceGet.body).toStrictEqual(newUser);

      // UPDATE
      // We try to update the created record with a PUT api/users/{userId}request
      const updatedUser = {
        id: newUser.id,
        username: "Modified username",
        age: 22,
        hobbies: ["hiking"],
      };
      const responcePut = await request
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
  });

  it(`GET, PUT api/users/:userId respond with 400 when :userId is not uuid`, async () => {
    let responce = await request.get(`${ENDPOINTS.users}/not-valid-uuid`).expect(400);
    expect(responce.text).toBe("User Id is not valid");

    responce = await request.put(`${ENDPOINTS.users}/not-valid-uuid`).expect(400);
    expect(responce.text).toBe("User Id is not valid");
  });
});
