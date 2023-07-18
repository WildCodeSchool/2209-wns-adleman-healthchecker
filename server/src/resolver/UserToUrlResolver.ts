import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { ContextType } from "../auth/customAuthChecker";

import datasource from "../database";
import { ApolloError } from "apollo-server-errors";
import UserToUrl, {
  FrequencyInput,
  LatencyTresholfInput,
} from "../entity/UserToUrl";
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

    return await datasource.getRepository(UserToUrl).save(exisitingUserToUrl);
  }

  @Authorized()
  @Mutation(() => UserToUrl)
  async updateLatencyTreshhold(
    @Arg("data") data: LatencyTresholfInput,
    @Ctx() ctx: ContextType
  ): Promise<UserToUrl> {
    const exisitingUserToUrl = await datasource
      .getRepository(UserToUrl)
      .findOne({ where: { userId: ctx.currentUser?.id, urlId: data.urlId } });
    if (exisitingUserToUrl === null) throw new ApolloError("invalid url");

    exisitingUserToUrl.latency_threshold = data.threshold;

    return await datasource.getRepository(UserToUrl).save(exisitingUserToUrl);
  }
}
