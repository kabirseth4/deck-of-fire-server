import request from "supertest";
import app from "../app";
import knex from "../configs/knex.config.js";
import deckModel from "../models/deck.model.js";
import cardModel from "../models/card.model.js";

describe("POST /users/register", () => {
  it("returns new user and 201", async () => {
    await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        email: "new.user@test.com",
        password: "S00per$3cret",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          username: "newuser",
          email: "new.user@test.com",
        });
      });
  });

  it("adds default deck to new user", async () => {
    const { body: user } = await request(app).post("/users/register").send({
      username: "newuser",
      email: "new.user@test.com",
      password: "S00per$3cret",
    });

    const decks = await deckModel.getAll(user.id);

    expect(decks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: "The Deck of Fire",
          is_custom: 0,
          is_scored: 0,
          is_playable: 1,
        }),
      ])
    );
  });

  it("adds default cards to new user", async () => {
    const { body: user } = await request(app).post("/users/register").send({
      username: "newuser",
      email: "new.user@test.com",
      password: "S00per$3cret",
    });

    const cards = await cardModel.getAll(user.id);

    expect(cards.length).toEqual(13);
  });

  it("adds default cards to new user's default deck", async () => {
    const { body: user } = await request(app).post("/users/register").send({
      username: "newuser",
      email: "new.user@test.com",
      password: "S00per$3cret",
    });

    const [defaultDeck] = await deckModel.getAll(user.id);

    const cards = await deckModel.getCards(defaultDeck.id);

    expect(cards.length).toEqual(13);
  });

  it("returns 400 if body is missing username", async () => {
    await request(app)
      .post("/users/register")
      .send({ email: "new.user@test.com", password: "S00per$3cret" })
      .expect(400);
  });

  it("returns 400 if body is missing email", async () => {
    await request(app)
      .post("/users/register")
      .send({ username: "newuser", password: "S00per$3cret" })
      .expect(400);
  });

  it("returns 400 if body is missing password", async () => {
    await request(app)
      .post("/users/register")
      .send({ username: "newuser", email: "new.user@test.com" })
      .expect(400);
  });

  it("returns 400 if email is an invalid format", async () => {
    await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        email: "new.user.com",
        password: "S00per$3cret",
      })
      .expect(400);
  });

  it("returns 409 if username is already in use", async () => {
    await request(app)
      .post("/users/register")
      .send({
        username: "testuser",
        email: "test.user@test.com",
        password: "S00per$3cret",
      })
      .expect(409);
  });

  it("returns 409 if email is already in use", async () => {
    await request(app)
      .post("/users/register")
      .send({
        username: "testuser2",
        email: "test.user@email.com",
        password: "S00per$3cret",
      })
      .expect(409);
  });

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        email: "new.user@email.com",
        password: "S00per$3cret",
      })
      .expect(500);

    await knex.migrate.latest();
  });
});

describe("POST /users/login", () => {
  it("returns user id and auth token, with status 200", async () => {
    await request(app)
      .post("/users/login")
      .send({ email: "test.user@email.com", password: "S00per$3cret" })
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          id: 1,
          token: expect.stringMatching(
            /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/
          ),
        });
      });
  });

  it("returns 400 if body is missing email", async () => {
    await request(app)
      .post("/users/login")
      .send({ password: "S00per$3cret" })
      .expect(400);
  });

  it("returns 400 if body is missing password", async () => {
    await request(app)
      .post("/users/login")
      .send({ email: "test.user@email.com" })
      .expect(400);
  });

  it("returns 400 if email is an invalid format", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "test.user.com",
        password: "S00per$3cret",
      })
      .expect(400);
  });

  it("returns 401 if email is not found", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "null.user@email.com",
        password: "S00per$3cret",
      })
      .expect(401);
  });

  it("returns 401 if password is incorrect", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "test.user@email.com",
        password: "supersecret",
      })
      .expect(401);
  });

  it("returns 500 if database error", async () => {
    await knex.migrate.rollback();

    await request(app)
      .post("/users/login")
      .send({
        email: "test.user@email.com",
        password: "S00per$3cret",
      })
      .expect(500);

    await knex.migrate.latest();
  });
});
