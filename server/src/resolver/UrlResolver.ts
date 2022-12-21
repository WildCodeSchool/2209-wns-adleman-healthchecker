import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Url, { createUrlInput } from "../entity/Url";
import datasource from "../database";

@Resolver(Url)
export class UrlResolver {
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    return await datasource.getRepository(Url).find();
  }

  @Mutation(() => Url)
  async createUrl(@Arg("url") url: createUrlInput): Promise<Url> {
    return await datasource.getRepository(Url).save(url);
  }
}
