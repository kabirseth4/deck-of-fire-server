export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface User extends NewUser {
  id: number;
  password: undefined;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
