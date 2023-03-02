import { ApolloError } from "apollo-server-errors";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import datasource from "../database";
import User, {
  getSafeAttributes,
  hashPassword,
  UserInput,
  UserInputLogin,
  verifyPassword,
} from "../entity/User";
import { ContextType } from "../auth/customAuthChecker";
import jwt from "jsonwebtoken";
import { env } from "../environment";
import Url from "../entity/Url";
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
    return getSafeAttributes(ctx.currentUser as User);
  }

  @Query(() => User)
  async getUrlsByUserId(@Arg("userId") id: number): Promise<User> {
    // const urlsByUserId = await datasource.getRepository(User).findOne({
    //   where: { id },
    //   relations: ["urls" ],
    // });

    const urlsByUserId = await datasource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .leftJoinAndSelect("user.urls", "url")
      .leftJoinAndSelect("url.responses", "response")
      .getOne();

    if (urlsByUserId === null)
      throw new ApolloError("Urls not found", "NOT_FOUND");
    return urlsByUserId;
  }

  @FieldResolver(() => [Url])
  async urls(@Root() user: User): Promise<Url[]> {
    return user.urls;
  }

  @FieldResolver(() => [Response])
  async responses(@Root() url: Url): Promise<Response[]> {
    return url.responses;
  }
}
