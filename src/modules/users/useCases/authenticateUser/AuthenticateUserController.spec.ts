import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@database/index";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be possible authenticate an exist user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test authenticate",
      email: "usertestauthenticate@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertestauthenticate@email.com",
      password: "1234"
    });

    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty("token");
  });

  it("Should not be possible authenticate an non exist user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "nonexistsuser@email.com",
      password: "1234"
    });

    expect(responseToken.status).toBe(401);
  });

});
