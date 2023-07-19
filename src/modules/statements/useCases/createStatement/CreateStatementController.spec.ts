import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "@database/index";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be possible an exists user create a deposit statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test deposit",
      email: "deposittest@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "deposittest@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      })

    expect(response.status).toBe(201);
  });

  it("Should not be possible a non exists user create a deposit statement", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "test deposit"
      })

    expect(response.status).toBe(401);
  });

  it("Should be possible an exists user create a withdraw statement with sufficient funds", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test withdraw sufficient funds",
      email: "withdraw@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "withdraw@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      })

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test withdraw"
      })

    expect(response.status).toBe(201);
  });

  it("Should noy be possible a non exists user create a withdraw statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test withdraw sufficient funds",
      email: "withdraw@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "withdraw@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      })

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "test withdraw"
      })

    expect(response.status).toBe(401);
  });

  it("Should not be possible an exists user create a withdraw statement with insufficient funds", async () => {
    await request(app).post("/api/v1/users").send({
      name: "user test withdraw insufficient funds",
      email: "withdraw2@email.com",
      password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "withdraw2@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 200,
        description: "test deposit"
      })

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        amount: 201,
        description: "test withdraw"
      })

    const { message } = response.body;

    expect(response.status).toBe(400);
    expect(message).toEqual("Insufficient funds");
  });

});
