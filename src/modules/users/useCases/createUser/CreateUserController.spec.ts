import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@database/index";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be possible create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "user test",
      email: "usertest2@email.com",
      password: "1234"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be possible create a new user, with same email", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "user test",
      email: "usertest2@email.com",
      password: "1234"
    });

    expect(response.status).toBe(400);
  });

});
