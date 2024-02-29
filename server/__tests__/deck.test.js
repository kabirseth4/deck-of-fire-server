const request = require("supertest");
const app = require("../app");
const knex = require("../configs/knex.config");
const jwt = require("jsonwebtoken");

const userId = 1;
const incorrectUserId = 999;
const authHeader = {};
const incorrectAuthHeader = {};

beforeAll(async () => {
  await knex.migrate.latest();

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
});

beforeEach(async () => {
  await knex.seed.run();
});

afterAll(async () => {
  await knex.migrate.rollback();
  await knex.destroy();

  delete authHeader.Authorization;
  delete incorrectAuthHeader.Authorization;
});

describe("GET /users/:userId/decks", () => {
  it("returns all decks for user", async () => {
    await request(app)
      .get(`/users/${userId}/decks`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(expect.any(Array));
        expect(body).toHaveLength(8);
        body.forEach((deck) => {
          expect(deck).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              is_custom: expect.any(Number),
              is_scored: expect.any(Number),
              is_playable: expect.any(Number),
            })
          );
        });
      });
  });

  it("returns 404 if user does not exist", async () => {
    await request(app)
      .get(`/users/${incorrectUserId}/decks`)
      .set(incorrectAuthHeader)
      .expect(404);
  });

  it("returns 401 if no auth header", async () => {
    await request(app).get(`/users/${userId}/decks`).expect(401);
  });

  it("returns 403 if auth token is for different user", async () => {
    await request(app)
      .get(`/users/${userId}/decks`)
      .set(incorrectAuthHeader)
      .expect(403);
  });
});
