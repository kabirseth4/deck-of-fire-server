const request = require("supertest");
const app = require("../app");
const knex = require("../configs/knex.config");

beforeAll(async () => {
  await knex.migrate.latest();
});

beforeEach(async () => {
  await knex.seed.run();
});

afterAll(async () => {
  await knex.migrate.rollback();
  await knex.destroy();
});

describe("POST /users/register", () => {
  it("returns created user and 201", async () => {
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

  it("adds default deck to created user", async () => {
    const { body: user } = await request(app).post("/users/register").send({
      username: "newuser",
      email: "new.user@test.com",
      password: "S00per$3cret",
    });

    const { body: auth } = await request(app)
      .post("/users/login")
      .send({ email: "new.user@test.com", password: "S00per$3cret" });

    await request(app)
      .get(`/users/${user.id}/decks`)
      .set("Authorization", `Bearer ${auth.token}`)
      .expect((res) => {
        expect(res.body).toEqual(
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
