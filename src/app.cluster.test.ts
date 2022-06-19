import { describe, expect, it } from "vitest";
import supertest, { SuperTest } from "supertest";
import "dotenv/config";

import { ENDPOINTS } from "./endpoints.js";
import { User } from "./users/user.model.js";

const isCluster = Boolean(process.env.TEST_CLUSTER);
const request = supertest(`http://localhost:${process.env.PORT}`);

describe.runIf(isCluster)("cluster app", () => {
  it("should sync added, updated, deleted users across all worker processes", async () => {
    const responce = await request.get(ENDPOINTS.users).expect(200);
    expect(responce.body).toStrictEqual([]);

    // create
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

    const pidAdd = Number(responceAddNew.headers["process-id"]);
    expect(pidAdd).toBeTruthy();

    const responceList = await requestUntilFindAnotherProcess(
      request.get(ENDPOINTS.users).expect(200),
      pidAdd
    );
    expect(responceList.body).toStrictEqual([newUser]);

    // update
    const updatedUser = {
      ...newUser,
      username: "Modified username",
    };
    const responcePut = await request
      .put(`${ENDPOINTS.users}/${updatedUser.id}`)
      .send(updatedUser)
      .expect(200);
    expect(responcePut.body).toStrictEqual(updatedUser);

    const pidUpdate = Number(responceAddNew.headers["process-id"]);
    expect(pidUpdate).toBeTruthy();

    const responceListAfterUpdate = await requestUntilFindAnotherProcess(
      request.get(ENDPOINTS.users).expect(200),
      pidUpdate
    );
    expect(responceListAfterUpdate.body).toStrictEqual([updatedUser]);

    // delete
    const responceDelete = await request
      .delete(`${ENDPOINTS.users}/${newUser.id}`)
      .expect(204);
    const pidDelete = Number(responceDelete.headers["process-id"]);
    expect(pidDelete).toBeTruthy();

    const responceListAfterDelete = await requestUntilFindAnotherProcess(
      request.get(ENDPOINTS.users).expect(200),
      pidDelete
    );
    expect(responceListAfterDelete.body).toStrictEqual([]);
  });
});

async function requestUntilFindAnotherProcess(
  request: supertest.Test,
  pid: number
): Promise<supertest.Response> {
  let pidRequested = pid;
  let responce: supertest.Response | undefined;
  while (pid === pidRequested) {
    responce = await request;
    pidRequested = Number(responce.headers["process-id"]);
  }

  if (!responce) throw new Error("Responce is not collected");

  return responce;
}
