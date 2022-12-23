import { Arg, Mutation, Query, Resolver } from "type-graphql";
import Url, { createUrlInput } from "../entity/Url";
import Response from "../entity/Response";
import datasource from "../database";
import { ApolloError } from "apollo-server-errors";

import { UrlService } from "../services/UrlService";

@Resolver(Url)
export class UrlResolver {
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    return await datasource.getRepository(Url).find();
  }

  @Mutation(() => Url)
  async createUrl(@Arg("url") url: createUrlInput): Promise<Response> {
    console.log("-------------------------------------");
    console.log(url.url);

    /// VALIDATION URL
    /// REGEX
    /// FORMAT

    const urlExist = await datasource
      .getRepository(Url)
      .findOneBy({ url: url.url });

    const service = new UrlService();
    const responseService = await service.getResponse(url.url);
    console.log("La reponse");
    console.log(responseService);

    let urlId = null;

    if (urlExist === null) {
      const urlAdded = await datasource.getRepository(Url).save(url);
      console.log("URL N'EXISTE PAS");
      console.log(urlAdded);

      if (urlAdded !== null) urlId = urlAdded.id;
    }

    if (urlExist !== null) urlId = urlExist.id;

    if (urlId === null) throw new ApolloError("Response not added");

    const response = {
      url_id: urlId,
      response_status: responseService.response_status,
      latency: responseService.latency,
    };

    return await datasource.getRepository(Response).save(response);
  }
}
