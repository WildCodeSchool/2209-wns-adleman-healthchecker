import { ApolloError } from "apollo-server-errors";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../database";
import User, {
  hashPassword,
  UserInput,
  UserInputLogin,
  verifyPassword,
} from "../entity/User";
import { ContextType } from "../auth/customAuthChecker";
import jwt from "jsonwebtoken";
import { env } from "../environment";
import UserToUrl from "../entity/UserToUrl";
import Response from "../entity/Response";

@Resolver(User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("data") data: UserInput): Promise<User> {
    const exisitingUser = await datasource
      .getRepository(User)
      .findOne({ where: { email: data.email } });

    if (exisitingUser !== null) throw new ApolloError("EMAIL_ALREADY_EXISTS");

    const hashedPassword = await hashPassword(data.password);
    return await datasource
      .getRepository(User)
      .save({ ...data, hashedPassword });
  }

  @Mutation(() => String)
  async login(
    @Arg("data") { email, password }: UserInputLogin,
    @Ctx() ctx: ContextType
  ): Promise<string> {
    const user = await datasource
      .getRepository(User)
      .findOne({ where: { email } });

    if (
      user === null ||
      typeof user.hashedPassword !== "string" ||
      !(await verifyPassword(password, user.hashedPassword))
    )
      throw new ApolloError("invalid credentials");

    // https://www.npmjs.com/package/jsonwebtoken
    const token = jwt.sign({ userId: user.id }, env.JWT_PRIVATE_KEY);

    // https://stackoverflow.com/a/40135050
    ctx.res.cookie("token", token, {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
    });

    user.last_connection = new Date();
    await datasource.getRepository(User).save(user);

    return token;
  }

  @Mutation(() => String)
  async logout(@Ctx() ctx: ContextType): Promise<string> {
    ctx.res.clearCookie("token");
    return "OK";
  }

  @Authorized()
  @Query(() => User)
  async profile(@Ctx() ctx: ContextType): Promise<User> {
    const profile = await datasource.getRepository(User).findOne({
      where: { id: ctx.currentUser?.id },
    });

    return profile as User;
  }

  @Authorized()
  @Query(() => User)
  async getUrlsByUserId(@Ctx() ctx: ContextType): Promise<User> {
    const user = await datasource.getRepository(User).findOne({
      where: { id: ctx.currentUser?.id },
      relations: { userToUrls: { url: true } },
    });

    if (user === null) throw new ApolloError("Urls not found", "NOT_FOUND");

    const userToUrls = await Promise.all(
      user.userToUrls.map(async (u: UserToUrl) => {
        // On a user.last_connection
        // On prend toutes les réponses après last_connection

        const responses = await datasource
          .getRepository(Response)
          .find({ where: { urlId: u.urlId }, take: 10, order: { id: "DESC" } });
        return { ...u, url: { ...u.url, responses } };
      })
    );

    return { ...user, userToUrls };
  }

  // @FieldResolver(() => [UserToUrl])
  // async userToUrls(@Root() user: User): Promise<UserToUrl[]> {
  //   return user.userToUrls;
  // }

  // @FieldResolver(() => [Url])
  // async url(@Root() userToUrl: UserToUrl): Promise<Url> {
  //   return userToUrl.url;
  // }

  // @FieldResolver(() => [Response])
  // async responses(@Root() url: Url): Promise<Response[]> {
  //   return url.responses;
  // }

  // @FieldResolver(() => [User])
  // async user(@Root() userToUrl: UserToUrl): Promise<User> {
  //   return userToUrl.user;
  // }
}
