import request from "supertest";
import app from "../app";
import knex from "../configs/knex.config.js";

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

  it("adds default deck and cards to new user", async () => {
    const { body: user } = await request(app).post("/users/register").send({
      username: "newuser",
      email: "new.user@test.com",
      password: "S00per$3cret",
    });

    const decks = await knex("deck")
      .where({ user_id: user.id })
      .select("id", "name", "is_scored", "is_custom", "is_playable");

    expect(decks.length).toEqual(1);

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

    const cards = await knex("card")
      .where({ user_id: user.id })
      .select("id", "name", "description");

    expect(cards.length).toEqual(13);

    const deckCards = await knex("card")
      .join("deck_card", "deck_card.card_id", "card.id")
      .where({ deck_id: decks[0].id });

    expect(deckCards.length).toEqual(13);
  });

  it("returns 400 if body has missing or invalid properties", async () => {
    // missing username
    await request(app)
      .post("/users/register")
      .send({ email: "new.user@test.com", password: "S00per$3cret" })
      .expect(400);

    // missing email
    await request(app)
      .post("/users/register")
      .send({ username: "newuser", password: "S00per$3cret" })
      .expect(400);

    // invalid email
    await request(app)
      .post("/users/register")
      .send({
        username: "newuser",
        email: "new.user.com",
        password: "S00per$3cret",
      })
      .expect(400);

    // missing password
    await request(app)
      .post("/users/register")
      .send({ username: "newuser", email: "new.user@test.com" })
      .expect(400);
  });

  it("returns 409 if username or email is already in use", async () => {
    // username conflict
    await request(app)
      .post("/users/register")
      .send({
        username: "testuser",
        email: "test.user@test.com",
        password: "S00per$3cret",
      })
      .expect(409);

    // email conflict
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

  it("returns 401 if login credentials are invalid", async () => {
    // email invalid
    await request(app)
      .post("/users/login")
      .send({
        email: "null.user@email.com",
        password: "S00per$3cret",
      })
      .expect(401);

    // password invalid
    await request(app)
      .post("/users/login")
      .send({
        email: "test.user@email.com",
        password: "supersecret",
      })
      .expect(401);
  });

  it("returns 400 if body has missing or incorrectly formatted properties", async () => {
    // missing email
    await request(app)
      .post("/users/login")
      .send({ password: "S00per$3cret" })
      .expect(400);

    // missing password
    await request(app)
      .post("/users/login")
      .send({ email: "test.user@email.com" })
      .expect(400);

    // email incorrect format
    await request(app)
      .post("/users/login")
      .send({
        email: "test.user.com",
        password: "S00per$3cret",
      })
      .expect(400);
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
