const bcrypt = require("bcrypt");

module.exports = [
  {
    id: 1,
    first_name: "Test",
    last_name: "User",
    username: "testuser",
    email: "test.user@email.com",
    password: bcrypt.hashSync("password123", 6),
  },
  {
    id: 2,
    first_name: "New",
    last_name: "User",
    username: "newuser",
    email: "new.user@email.com",
    password: bcrypt.hashSync("password123", 6),
  },
];
