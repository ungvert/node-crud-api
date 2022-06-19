import { uuidValidateV4 } from "../common/validateUuid.js";
import { v4 } from "uuid";

export interface User {
  id?: UserId;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserId = string;

export function validateUserId(id: UserId) {
  return uuidValidateV4(id);
}

export function generateUserId(): UserId {
  return v4();
}

export function isUserValid(user: unknown): user is User {
  if (!user || typeof user !== "object") return false;

  const age = (user as User).age;
  if (!age || typeof age !== "number") return false;

  const username = (user as User).username;
  if (!username || typeof username !== "string") return false;

  const hobbies = (user as User).hobbies;
  if (!Array.isArray(hobbies) || hobbies.some((item) => typeof item !== "string"))
    return false;

  return true;
}
