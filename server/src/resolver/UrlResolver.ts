import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Url, { createUrlInput } from "../entity/Url";
// import Response from "../entity/Response";
import datasource from "../database";

import { UrlService } from "../services/UrlService";

@Resolver(Url)
export class UrlResolver {
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    return await datasource.getRepository(Url).find();
  }

  @Mutation(() => Url)
  async createUrl(@Arg("url") url: createUrlInput): Promise<Url> {
    console.log("-------------------------------------");
    console.log(url.url);

    const service = new UrlService();

    const response = service.getResponse(url.url);
    console.log("La reponse");
    console.log(response);

    // await datasource.getRepository(Response).save();
    return await datasource.getRepository(Url).save(url);
  }
}
