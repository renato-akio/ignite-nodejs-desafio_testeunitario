import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let createUserRepositoryInMemory: InMemoryUsersRepository;

describe("Create user", () => {
  beforeEach(() => {
    createUserRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(createUserRepositoryInMemory);
  })

  it("Should be possible create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be possible create a new user with same email", async () => {
    expect(async () =>{
      await createUserUseCase.execute({
        name: "new user 1",
        email: "newuser@test.com",
        password: "new.user"
      });

      await createUserUseCase.execute({
        name: "new user 2",
        email: "newuser@test.com",
        password: "new.user2"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
