const knex = require("../../configs/knex.config");
const jwt = require("jsonwebtoken");

const userId = 1;
const incorrectUserId = 999;
const authHeader = {};
const incorrectAuthHeader = {};

const createAuthHeaders = () => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  authHeader.Authorization = `Bearer ${token}`;

  const incorrectToken = jwt.sign(
    { id: incorrectUserId },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  incorrectAuthHeader.Authorization = `Bearer ${incorrectToken}`;
};

const deleteAuthHeaders = () => {
  delete authHeader.Authorization;
  delete incorrectAuthHeader.Authorization;
};

beforeAll(async () => {
  await knex.migrate.latest();
  createAuthHeaders();
});

beforeEach(async () => {
  await knex.seed.run();
});

afterAll(async () => {
  await knex.migrate.rollback();
  await knex.destroy();
  deleteAuthHeaders();
});

module.exports = {
  userId,
  incorrectUserId,
  authHeader,
  incorrectAuthHeader,
};
