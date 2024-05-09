import knex from "../../configs/knex.config";
import jwt from "jsonwebtoken";
import type { IncomingHttpHeaders } from "http";

export const userId = 1;
export const incorrectUserId = 999;
export const authHeader: IncomingHttpHeaders = {};
export const incorrectAuthHeader: IncomingHttpHeaders = {};

const createAuthHeaders = () => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  authHeader.Authorization = `Bearer ${token}`;

  const incorrectToken = jwt.sign(
    { id: incorrectUserId },
    process.env.JWT_SECRET as string,
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
