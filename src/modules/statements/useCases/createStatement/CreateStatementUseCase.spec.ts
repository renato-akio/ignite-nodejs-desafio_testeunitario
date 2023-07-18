import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
  });

  it("Should be possible an exists user create an deposit statement", async () => {
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

    expect(statement).toHaveProperty("id");
  });

  it("Should be possible an exists user create an withdraw statement with sufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 200,
      type: OperationType.DEPOSIT,
      description: "deposit"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      type: OperationType.WITHDRAW,
      description: "withdraw"
    });

    expect(statement.amount).toEqual(100);
  });

  it("Should not be possible an exists user create an withdraw statement with insufficient funds", async () => {
    expect(async()=>{
      const user = await createUserUseCase.execute({
        name: "new user",
        email: "newuser@test.com",
        password: "new.user"
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        amount: 100,
        type: OperationType.DEPOSIT,
        description: "deposit"
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        amount: 101,
        type: OperationType.WITHDRAW,
        description: "withdraw"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should not be possible an non exists user create a deposit statement", async () => {
    expect(async()=>{
      await createStatementUseCase.execute({
        user_id: "123456",
        amount: 200,
        type: OperationType.DEPOSIT,
        description: "deposit 1"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

});
