import { User, UserId } from "./users/user.model.js";

const users: Record<UserId, User> = {};

export let db = { users };

export type Database = typeof db;
export const updateDb = (newDb: Database): Database => {
  db = newDb;
  return db;
};
