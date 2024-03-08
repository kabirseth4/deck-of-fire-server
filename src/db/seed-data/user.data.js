import { hashSync } from "bcrypt";

export default [
  {
    id: 1,
    username: "testuser",
    email: "test.user@email.com",
    password: hashSync("S00per$3cret", 6),
  },
  {
    id: 2,
    username: "testuser2",
    email: "test.user2@email.com",
    password: hashSync("S00per$3cret", 6),
  },
];
