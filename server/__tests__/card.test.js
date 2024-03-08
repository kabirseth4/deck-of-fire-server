const request = require("supertest");
const app = require("../app");
const knex = require("../configs/knex.config");

const { userId, authHeader } = require("./helpers/test.setup");

const { userValidationTestCases } = require("./helpers/test.cases");

describe("GET /users/:userId/cards", () => {
  it("returns all cards for user", async () => {
    await request(app)
      .get(`/users/${userId}/cards`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
            }),
          ])
        );
      });
  });

  it.each(userValidationTestCases)(
    "$description",
    async ({ user, header, status }) => {
      await request(app).get(`/users/${user}/cards`).set(header).expect(status);
    }
  );

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .get(`/users/${userId}/cards`)
      .set(authHeader)
      .expect(500);

    await knex.migrate.latest();
  });
});

describe("POST /users/:userId/cards", () => {
  it("adds new card to user", async () => {
    const { body: card } = await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ name: "New card", description: "This is a new card." });

    const cards = await knex("card").where({ user_id: userId });

    expect(cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: card.id,
          name: "New card",
          description: "This is a new card.",
        }),
      ])
    );
  });

  it("returns new card and 201", async () => {
    await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ name: "New card", description: "This is a new card." })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: "New card",
            description: "This is a new card.",
          })
        );
      });
  });

  it("returns 400 if no name in request body", async () => {
    await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ description: "This is a new card." })
      .expect(400);
  });

  it("returns 400 if no description in request body", async () => {
    await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ name: "New card" })
      .expect(400);
  });

  it.each(userValidationTestCases)(
    "$description",
    async ({ user, header, status }) => {
      await request(app)
        .post(`/users/${user}/cards`)
        .set(header)
        .send({ name: "New card" })
        .expect(status);
    }
  );

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ name: "New card" })
      .expect(500);

    await knex.migrate.latest();
  });
});
