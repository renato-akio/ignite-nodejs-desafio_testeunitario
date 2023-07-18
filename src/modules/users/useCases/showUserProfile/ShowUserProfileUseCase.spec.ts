import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  });

  it("Should be possible to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "new user",
      email: "newuser@test.com",
      password: "new.user"
    });

    const profileUser = await showUserProfileUseCase.execute(user.id);

    expect(profileUser).toHaveProperty("name");
  });

  it("Should not be possible to show a user profile from a non exists user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("123456");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

})
