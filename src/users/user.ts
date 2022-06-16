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
