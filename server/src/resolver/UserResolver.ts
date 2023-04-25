import { ApolloError } from "apollo-server-errors";
import {
  Arg,
  Authorized,
  Ctx,
  // FieldResolver,
  Mutation,
  Query,
  Resolver,
  // Root,
} from "type-graphql";
import datasource from "../database";
import User, {
  // getSafeAttributes,
  hashPassword,
  UserInput,
  UserInputLogin,
  verifyPassword,
} from "../entity/User";
import { ContextType } from "../auth/customAuthChecker";
import jwt from "jsonwebtoken";
import { env } from "../environment";
// import Url from "../entity/Url";
// import Response from "../entity/Response";
// import UserToUrl from "../entity/UserToUrl";

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
    const user = await datasource.getRepository(User).findOne({
      where: { id: ctx.currentUser?.id },
      relations: ["userToUrls"],
    });

    return user as User;
    // return getSafeAttributes(ctx.currentUser as User);
  }

  @Query(() => User)
  async getUrlsByUserId(@Arg("userId") id: number): Promise<User> {
    // const urlsByUserId = await datasource.getRepository(User).findOne({
    //   where: { id },
    //   relations: ["urls" ],
    // });

    const urlsByUserId = await datasource.getRepository(User).findOne({
      where: { id },
      relations: { userToUrls: { url: { responses: true } } },
    });

    // .createQueryBuilder("user")
    // .where("user.id = :id", { id })
    // .leftJoinAndSelect("user.userToUrls", "userToUrl")
    // .leftJoinAndSelect("userToUrl.url", "url")
    // .leftJoinAndSelect("url.responses", "response")
    // .select(["user", "userToUrl", "url", "response"])
    // .getOne();

    if (urlsByUserId === null)
      throw new ApolloError("Urls not found", "NOT_FOUND");
    // console.log(urlsByUserId.userToUrls[0].url);
    return urlsByUserId;
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
