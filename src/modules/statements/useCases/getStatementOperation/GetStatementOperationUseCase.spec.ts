import "reflect-metadata"
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { AppError } from "@shared/errors/AppError";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);

    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementRepositoryInMemory);
  });

  it("Should be possible an exists user gets an exists statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 200,
      type: OperationType.DEPOSIT,
      description: "deposit 1"
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("Should not be possible an non exists user gets an exists statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 200,
      type: OperationType.DEPOSIT,
      description: "deposit 1"
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: statement.id
      })
    ).rejects.toEqual(new AppError('User not found', 404));
  });

  it("Should not be possible an exists user gets an non exists statement operation", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "new user",
        email: "newuser@test.com",
        password: "new.user"
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        amount: 200,
        type: OperationType.DEPOSIT,
        description: "deposit 1"
      });

      const statementOperation = await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "123456"
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  });

});
