import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@database/index";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be possible an exists user gets statement operation", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test",
      email: "usertest@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertest@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const statementResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      });

    const { id } = statementResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("type");
  });

  it("Should not be possible an exists user gets a non exists statement operation", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test 3",
      email: "usertest3@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertest3@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const statementResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      });

    const response = await request(app)
      .get("/api/v1/statements/00000000-0000-0000-0000-000000000000")
      .set({
        Authorization: `Bearer ${token}`
      });

    const {message} = response.body;

    expect(response.status).toBe(404);
    expect(message).toEqual("Statement not found");
  });

  it("Should not be possible a non exists user gets statement operation", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test 2",
      email: "usertest2@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertest2@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const statementResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      });

    const { id } = statementResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`);

    expect(response.status).toBe(401);
  });

});
