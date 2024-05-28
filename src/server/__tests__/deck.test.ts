import request from "supertest";
import app from "../app.js";
import knex from "../configs/knex.config.js";
import { userId, authHeader } from "./helpers/test.setup.js";
import {
  userValidationTestCases,
  deckValidationTestCases,
} from "./helpers/test.cases.js";
import { Deck, Card } from "../types/index.js";

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
        body.forEach((deck: Deck) => {
          expect(deck).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              is_custom: expect.any(Boolean),
              is_scored: expect.any(Boolean),
              is_playable: expect.any(Boolean),
            })
          );
        });
      });
  });

  it.each(userValidationTestCases)(
    "$description",
    async ({ user, header, status }) => {
      await request(app).get(`/users/${user}/decks`).set(header).expect(status);
    }
  );

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
            is_custom: false,
            is_scored: false,
            is_playable: false,
          })
        );
      });
  });

  it("returns 400 if no name in request body", async () => {
    await request(app)
      .post(`/users/${userId}/decks`)
      .set(authHeader)
      .send({})
      .expect(400);
  });

  it.each(userValidationTestCases)(
    "$description",
    async ({ user, header, status }) => {
      await request(app)
        .post(`/users/${user}/decks`)
        .set(header)
        .send({ name: "New deck" })
        .expect(status);
    }
  );

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
            is_custom: expect.any(Boolean),
            is_scored: expect.any(Boolean),
            is_playable: expect.any(Boolean),
            cards: expect.any(Array),
          })
        );
      });
  });

  it("returns cards, with names, descriptions, and occurrences, for custom deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/1`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body: { cards } }) => {
        cards.forEach((card: Card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              occurrences: expect.any(Number),
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

  it("returns cards, with names, descriptions, occurrences, and penalties, for custom scored deck", async () => {
    await request(app)
      .get(`/users/${userId}/decks/2`)
      .set(authHeader)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(({ body: { cards } }) => {
        cards.forEach((card: Card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              occurrences: expect.any(Number),
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
        cards.forEach((card: Card) => {
          expect(card).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
            })
          );
          expect(card).toEqual(
            expect.not.objectContaining({
              occurrences: expect.any(Number),
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
        cards.forEach((card: Card) => {
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
              occurrences: expect.any(Number),
            })
          );
        });
      });
  });

  it.each(deckValidationTestCases)("$description", async ({ deck, status }) => {
    await request(app)
      .get(`/users/${userId}/decks/${deck}`)
      .set(authHeader)
      .expect(status);
  });

  it.each(userValidationTestCases)(
    "$description",
    async ({ user, header, status }) => {
      await request(app)
        .get(`/users/${user}/decks/${deckId}`)
        .set(header)
        .expect(status);
    }
  );

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .get(`/users/${userId}/decks/${deckId}`)
      .set(authHeader)
      .expect(500);

    await knex.migrate.latest();
  });
});

describe("POST /users/:userId/decks/:deckId/cards", () => {
  const deckId = 5; // Empty deck

  it("adds cards to deck", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }, { card_id: 2 }, { card_id: 3 }]);

    const cards = await knex("deck_card").where({ deck_id: deckId });

    expect(cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          card_id: 1,
          deck_id: 5,
        }),
        expect.objectContaining({
          id: expect.any(Number),
          card_id: 2,
          deck_id: 5,
        }),
        expect.objectContaining({
          id: expect.any(Number),
          card_id: 3,
          deck_id: 5,
        }),
      ])
    );
  });

  it("returns added cards and 201", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }, { card_id: 2 }, { card_id: 3 }])
      .expect("Content-Type", /json/)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              card_id: 1,
              deck_id: 5,
            }),
            expect.objectContaining({
              id: expect.any(Number),
              card_id: 2,
              deck_id: 5,
            }),
            expect.objectContaining({
              id: expect.any(Number),
              card_id: 3,
              deck_id: 5,
            }),
          ])
        );
      });
  });

  it("returns 400 if no cards in request body", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([])
      .expect(400);
  });

  it("returns 400 if request body is not an array", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send({ card_id: 1 })
      .expect(400);
  });

  it("returns 400 if no card_id in request body", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([{}])
      .expect(400);
  });

  it("returns 400 if no occurrences in request body for custom deck", async () => {
    await request(app)
      .post(`/users/${userId}/decks/6/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }])
      .expect(400);
  });

  it("returns 400 if no penalty in request body for scored deck", async () => {
    await request(app)
      .post(`/users/${userId}/decks/8/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }])
      .expect(400);
  });

  it("returns 409 if adding cards to standard deck exceeds 13", async () => {
    await request(app)
      .post(`/users/${userId}/decks/3/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }])
      .expect(409);

    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([
        { card_id: 1 },
        { card_id: 2 },
        { card_id: 3 },
        { card_id: 4 },
        { card_id: 5 },
        { card_id: 6 },
        { card_id: 7 },
        { card_id: 8 },
        { card_id: 9 },
        { card_id: 10 },
        { card_id: 11 },
        { card_id: 12 },
        { card_id: 13 },
        { card_id: 14 },
      ])
      .expect(409);
  });

  it("returns 409 if card already exist in deck", async () => {
    await request(app)
      .post(`/users/${userId}/decks/1/cards`)
      .set(authHeader)
      .send([{ card_id: 1, occurrences: 1 }])
      .expect(409);
  });

  it("returns 404 if card does not exist", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([{ card_id: 999 }])
      .expect(404);
  });

  it("returns 401 if card belongs to different user", async () => {
    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([{ card_id: 31 }])
      .expect(401);
  });

  it.each(deckValidationTestCases)("$description", async ({ deck, status }) => {
    await request(app)
      .get(`/users/${userId}/decks/${deck}/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }])
      .expect(status);
  });

  it.each(userValidationTestCases)(
    "$description",
    async ({ user, header, status }) => {
      await request(app)
        .post(`/users/${user}/decks/${deckId}/cards`)
        .set(header)
        .send([{ card_id: 1 }])
        .expect(status);
    }
  );

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .post(`/users/${userId}/decks/${deckId}/cards`)
      .set(authHeader)
      .send([{ card_id: 1 }])
      .expect(500);

    await knex.migrate.latest();
  });
});
