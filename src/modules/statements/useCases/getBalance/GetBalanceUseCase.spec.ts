import "reflect-metadata"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, userRepositoryInMemory);
  });

  it("Should be possible an exists user get balance", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id
    });

    expect(balance).toHaveProperty("balance");
  });

  it("Should not be possible an non exists user get balance", async () => {
    expect(async()=>{
      await getBalanceUseCase.execute({
        user_id: "123456"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });


});
