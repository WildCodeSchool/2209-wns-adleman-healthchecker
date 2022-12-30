import { Query, Resolver, Mutation, Arg } from "type-graphql";
import Response, { createResponseInput } from "../entity/Response";
import { ApolloError } from "apollo-server-errors";
import datasource from "../database";
import Url from "../entity/Url";

@Resolver(Response)
export class ResponseResolver {
  @Query(() => [Response])
  async getResponses(): Promise<Response[]> {
    return await datasource.getRepository(Response).find();
  }

  @Mutation(() => Response)
  async createResponse(
    @Arg("response") response: createResponseInput
  ): Promise<Response> {
    const urlExist = await datasource
      .getRepository(Url)
      .findOneBy({ id: response.urlId });

    if (urlExist === null)
      throw new ApolloError("Url id not found", "NOT_FOUND");

    return await datasource.getRepository(Response).save(response);
  }
}
