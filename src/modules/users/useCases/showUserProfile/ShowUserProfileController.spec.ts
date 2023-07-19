import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@database/index";

let connection: Connection;

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be possible show an user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test",
      email: "usertest2@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertest2@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
  });

  it("Should be possible show an user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test",
      email: "usertest2@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usertest2@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(200);
  });

  it("Should not be possible show an user profile without user authenticated", async () => {
    const response = await request(app)
      .get("/api/v1/profile");

    expect(response.status).toBe(401);
  });

});
