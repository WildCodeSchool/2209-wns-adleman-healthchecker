import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Url, { createUrlInput } from "../entity/Url";
import datasource from "../database";
import { ApolloError } from "apollo-server-errors";
import { UrlService } from "../services/UrlService";
import { ContextType } from "../auth/customAuthChecker";

import User from "../entity/User";

@Resolver(Url)
export class UrlResolver {
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    return await datasource
      .getRepository(Url)
      .find({ relations: ["responses"] });
  }

  @Query(() => Url)
  async getUrlById(@Arg("urlId") id: number): Promise<Url> {
    const urlExist = await datasource
      .getRepository(Url)
      .findOne({ where: { id }, relations: ["responses"] });
    if (urlExist === null) throw new ApolloError("Url not found", "NOT_FOUND");
    return urlExist;
  }

  @Authorized()
  @Mutation(() => Url)
  async createUrl(
    @Arg("url") url: createUrlInput,
    @Ctx() ctx: ContextType
  ): Promise<Url> {
    let user = null;
    if (
      ctx.currentUser?.id !== null &&
      typeof ctx.currentUser?.id !== "undefined"
    ) {
      user = await datasource.getRepository(User).findOne({
        where: { id: ctx.currentUser?.id },
        relations: ["userToUrls"],
      });
    }

    const urlService = new UrlService();

    const urlValid = await urlService.checkIfUrlIsValid(url.url);
    if (!urlValid) throw new ApolloError("Url is not valid");

    const { href: urlFormatted } = await urlService.formatUrl(url.url);

    const urlAlreadyExist = await datasource
      .getRepository(Url)
      .findOneBy({ url: urlFormatted });

    if (urlAlreadyExist === null) {
      const responseForNewUrl = await urlService.getResponse(urlFormatted);

      if (responseForNewUrl.response_status === null)
        throw new ApolloError(
          `Error while getting response for url : ${urlFormatted}`
        );

      return await urlService.saveResponseForNewUrlAndGetResponses(
        urlFormatted,
        responseForNewUrl,
        user
      );
    } else {
      const getResponseForExistingUrl = await urlService.getResponse(
        urlAlreadyExist.url
      );

      if (getResponseForExistingUrl.response_status === null)
        throw new ApolloError(
          `Error while getting response for url : ${urlAlreadyExist.url}`
        );

      return await urlService.saveAndGetResponsesFromExistingUrl(
        urlAlreadyExist,
        getResponseForExistingUrl,
        user
      );
    }
  }
}
