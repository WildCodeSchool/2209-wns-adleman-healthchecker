import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { ContextType } from "../auth/customAuthChecker";

import datasource from "../database";
import { ApolloError } from "apollo-server-errors";
import UserToUrl, { FrequencyInput } from "../entity/UserToUrl";
// import startCron from "../services/cronService";

@Resolver(UserToUrl)
export class UserToUrlResolver {
  @Authorized()
  @Mutation(() => UserToUrl)
  async updateFrequency(
    @Arg("data") data: FrequencyInput,
    @Ctx() ctx: ContextType
  ): Promise<UserToUrl> {
    const exisitingUserToUrl = await datasource
      .getRepository(UserToUrl)
      .findOne({ where: { userId: ctx.currentUser?.id, urlId: data.urlId } });

    if (exisitingUserToUrl === null) throw new ApolloError("invalid url");

    exisitingUserToUrl.frequency = data.frequency;

    // await startCron();

    return await datasource.getRepository(UserToUrl).save(exisitingUserToUrl);
  }
}
