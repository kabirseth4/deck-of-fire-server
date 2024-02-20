const bcrypt = require("bcrypt");

module.exports = [
  {
    id: 1,
    username: "testuser",
    email: "test.user@email.com",
    password: bcrypt.hashSync("password123", 6),
  },
  {
    id: 2,
    username: "newuser",
    email: "new.user@email.com",
    password: bcrypt.hashSync("password123", 6),
  },
];
