export interface User {
  id?: UserId;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserId = string;

// function validateUser(data: unknown): data is User {
//   if (typeof data !== "object" || data === null) {
//     throw new Error("not validated");
//     return false;
//   }
//   // getProperty(data, "username");
//   // data['username']

//   // if ("username" in data) {
//   //   throw new Error("not validated");
//   //   data;
//   // }
//   return true;
// }

// function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
//   return o[propertyName];
// }
