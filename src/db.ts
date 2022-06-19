import { User, UserId } from "./users/user.model.js";

const users: Record<UserId, User> = {
  //   "eeed65dc-202e-4930-890d-26b4848d4848": {
  //     username: "Test user",
  //     age: 42,
  //     hobbies: ["cooking", "painting", "hiking"],
  //   },
};

export const db = { users };

export type Database = typeof db;
export type GetDb = () => Database;
