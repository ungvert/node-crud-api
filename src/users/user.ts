export interface User {
  id?: UserId;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserId = string;
