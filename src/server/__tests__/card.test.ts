import request from "supertest";
import app from "../app.js";
import knex from "../configs/knex.config.js";
import { userId, authHeader } from "./helpers/test.setup.js";
import { userValidationTestCases } from "./helpers/test.cases.js";

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

  it("passes user validation test cases", async () => {
    await Promise.all(
      userValidationTestCases.map(async ({ user, header, status }) => {
        await request(app)
          .get(`/users/${user}/cards`)
          .set(header)
          .expect(status);
      })
    );
  });

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
  it("creates new card and returns card and 201", async () => {
    const newCard = { name: "New card", description: "This is a new card." };

    const { body: card } = await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send(newCard)
      .expect("Content-Type", /json/)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            ...newCard,
          })
        );
      });

    const cards = await knex("card").where({ user_id: userId });

    expect(cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: card.id,
          ...newCard,
        }),
      ])
    );
  });

  it("returns 400 if body is missing properties", async () => {
    // no name
    await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ description: "This is a new card." })
      .expect(400);

    // no description
    await request(app)
      .post(`/users/${userId}/cards`)
      .set(authHeader)
      .send({ name: "New card" })
      .expect(400);
  });

  it("passes user validation test cases", async () => {
    await Promise.all(
      userValidationTestCases.map(async ({ user, header, status }) => {
        await request(app)
          .post(`/users/${user}/cards`)
          .set(header)
          .send({ name: "New card" })
          .expect(status);
      })
    );
  });

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
