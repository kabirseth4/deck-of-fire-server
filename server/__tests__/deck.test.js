const request = require("supertest");
const app = require("../app");
const knex = require("../configs/knex.config");
const jwt = require("jsonwebtoken");

const userId = 1;
const incorrectUserId = 999;
const authHeader = {};
const incorrectAuthHeader = {};

const userValidationTestCases = [
  {
    description: "returns 404 if user does not exist",
    user: incorrectUserId,
    header: incorrectAuthHeader,
    status: 404,
  },
  {
    description: "returns 401 if no auth header",
    user: userId,
    header: {},
    status: 401,
  },
  {
    description: "returns 403 if auth token is for different user",
    user: userId,
    header: incorrectAuthHeader,
    status: 403,
  },
];

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

  userValidationTestCases.forEach(({ description, user, header, status }) => {
    it(description, async () => {
      await request(app).get(`/users/${user}/decks`).set(header).expect(status);
    });
  });

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .get(`/users/${userId}/decks`)
      .set(authHeader)
      .expect(500);

    await knex.migrate.latest();
  });
});

describe("POST /users/:userId/decks", () => {
  it("returns new deck and 201", async () => {
    await request(app)
      .post(`/users/${userId}/decks`)
      .set(authHeader)
      .send({ name: "New deck" })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: "New deck",
            is_custom: 0,
            is_scored: 0,
            is_playable: 0,
          })
        );
      });
  });

  it("adds new deck to user", async () => {
    const { body: deck } = await request(app)
      .post(`/users/${userId}/decks`)
      .set(authHeader)
      .send({ name: "New deck" });

    const decks = await knex("deck").where({ user_id: userId });

    expect(decks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: deck.id,
          name: "New deck",
          is_custom: 0,
          is_scored: 0,
          is_playable: 0,
        }),
      ])
    );
  });

  it("returns 400 if no name in request body", async () => {
    await request(app)
      .post(`/users/${userId}/decks`)
      .set(authHeader)
      .send({})
      .expect(400);
  });

  userValidationTestCases.forEach(({ description, user, header, status }) => {
    it(description, async () => {
      await request(app)
        .post(`/users/${user}/decks`)
        .set(header)
        .send({ name: "New deck" })
        .expect(status);
    });
  });

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .post(`/users/${userId}/decks`)
      .set(authHeader)
      .send({ name: "New deck" })
      .expect(500);

    await knex.migrate.latest();
  });
});

describe("GET /users/:userId/decks/:deckId", () => {
  const deckId = 1;

  it("returns deck details and cards for single deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/${deckId}`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            id: deckId,
            name: expect.any(String),
            is_custom: expect.any(Number),
            is_scored: expect.any(Number),
            is_playable: expect.any(Number),
            cards: expect.any(Array),
          })
        );
      });
  });

  it("returns cards, with names, descriptions, and occurences, for custom deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/1`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body: { cards } }) => {
        cards.forEach((card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              occurences: expect.any(Number),
            })
          );
          expect(card).toEqual(
            expect.not.objectContaining({
              penalty: expect.any(Number),
            })
          );
        });
      });
  });

  it("returns cards, with names, descriptions, occurences, and penalties, for custom scored deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/2`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body: { cards } }) => {
        cards.forEach((card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              occurences: expect.any(Number),
              penalty: expect.any(Number),
            })
          );
        });
      });
  });

  it("returns 13 cards, with names and descriptions, for standard deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/3`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body: { cards } }) => {
        expect(cards).toHaveLength(13);
        cards.forEach((card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
            })
          );
          expect(card).toEqual(
            expect.not.objectContaining({
              occurences: expect.any(Number),
              penalty: expect.any(Number),
            })
          );
        });
      });
  });

  it("returns 13 cards, with names, descriptions, and penalties, for scored standard deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/4`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body: { cards } }) => {
        expect(cards).toHaveLength(13);
        cards.forEach((card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              penalty: expect.any(Number),
            })
          );
          expect(card).toEqual(
            expect.not.objectContaining({
              occurences: expect.any(Number),
            })
          );
        });
      });
  });

  it("returns 404 if deck does not exist", async () => {
    await request(app)
      .get(`/users/${userId}/decks/999`)
      .set(authHeader)
      .expect(404);
  });

  it("returns 401 if deck belongs to different user", async () => {
    await request(app)
      .get(`/users/${userId}/decks/9`)
      .set(authHeader)
      .expect(401);
  });

  userValidationTestCases.forEach(({ description, user, header, status }) => {
    it(description, async () => {
      await request(app)
        .get(`/users/${user}/decks/${deckId}`)
        .set(header)
        .expect(status);
    });
  });

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .get(`/users/${userId}/decks/${deckId}`)
      .set(authHeader)
      .expect(500);

    await knex.migrate.latest();
  });
});
