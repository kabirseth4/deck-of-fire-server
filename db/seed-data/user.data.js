const bcrypt = require("bcrypt");

module.exports = [
  {
    id: 1,
    username: "testuser",
    email: "test.user@email.com",
    password: bcrypt.hashSync("S00per$3cret", 6),
  },
];
