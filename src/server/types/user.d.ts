import { Id } from "./index.js";

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface User extends NewUser {
  id: Id;
  password: undefined;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
