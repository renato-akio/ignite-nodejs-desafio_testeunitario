import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import exp from "constants";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;



describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be possible authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: "new.user"
    })

    expect(response).toHaveProperty("token");

  });

  it("Should not be possible authenticate an user with incorrect email", async () => {
    expect(async()=>{
      const user = await createUserUseCase.execute({
        name: "new user",
        email: "newuser@test.com",
        password: "new.user"
      });

      const response = await authenticateUserUseCase.execute({
        email: "newuser@test.com.br",
        password: "new.user"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be possible authenticate an user with incorrect password", async () => {
    expect(async()=>{
      const user = await createUserUseCase.execute({
        name: "new user",
        email: "newuser@test.com",
        password: "new.user"
      });

      const response = await authenticateUserUseCase.execute({
        email: "newuser@test.com",
        password: "new.users"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
