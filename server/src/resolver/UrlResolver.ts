import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import Url, { createUrlInput } from "../entity/Url";
import datasource from "../database";
import { ApolloError } from "apollo-server-errors";
import { UrlService } from "../services/UrlService";
import { ContextType } from "../auth/customAuthChecker";
import Response from "../entity/Response";

import User from "../entity/User";
import { TEST_DOCKER_URL } from "../const";
import UserToUrl from "../entity/UserToUrl";

@ObjectType()
class UrlWithTreshold {
  @Field(() => Url)
  url: Url;

  @Field()
  latency_treshold: number;
}

@Resolver(Url)
export class UrlResolver {
  @Query(() => [Url])
  async getUrls(): Promise<Url[]> {
    const urls = await datasource.getRepository(Url).find();

    const urlToReturn = await Promise.all(
      urls.map(async (url: Url) => {
        const responses = await datasource
          .getRepository(Response)
          .find({ where: { urlId: url.id }, take: 10, order: { id: "DESC" } });

        return { ...url, responses };
      })
    );

    return urlToReturn;
  }

  @Authorized()
  @Query(() => UrlWithTreshold)
  async getUrlById(
    @Arg("urlId") id: number,
    @Ctx() ctx: ContextType
  ): Promise<UrlWithTreshold> {
    const urlExist = await datasource
      .getRepository(Url)
      .findOne({ where: { id } });

    if (urlExist === null) throw new ApolloError("Url not found", "NOT_FOUND");

    const responses = await datasource.getRepository(Response).find({
      where: { urlId: urlExist.id },
      take: 1000,
      order: { id: "DESC" },
    });

    let userToUrlExist = null;
    let latencyTreshold = 0;
    if (
      ctx.currentUser?.id !== null &&
      typeof ctx.currentUser?.id !== "undefined"
    ) {
      userToUrlExist = await datasource.getRepository(UserToUrl).findOne({
        where: { userId: ctx.currentUser?.id, urlId: id },
      });

      if (userToUrlExist === null)
        throw new ApolloError("User To Url not found", "NOT_FOUND");

      latencyTreshold = userToUrlExist.latency_threshold;
    }
    urlExist.responses = responses;

    return { url: urlExist, latency_treshold: latencyTreshold };
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

    if (url.url === TEST_DOCKER_URL) {
      const urlAlreadyExist = await datasource
        .getRepository(Url)
        .findOneBy({ url: url.url });
      if (urlAlreadyExist === null) {
        const responseForNewUrl = await urlService.getResponse(TEST_DOCKER_URL);

        if (responseForNewUrl.response_status === null)
          throw new ApolloError(
            `Error while getting response for url : ${url.url}`
          );

        return await urlService.saveResponseForNewUrlAndGetResponses(
          url.url,
          responseForNewUrl,
          user
        );
      } else {
        const getResponseForExistingUrl = await urlService.getResponse(
          TEST_DOCKER_URL
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
    } else {
      const urlValid = await urlService.checkIfUrlIsValid(url.url);
      if (!urlValid) throw new ApolloError("Url is not valid");

      const { href: urlFormatted } = await urlService.formatUrl(url.url);
      const urlAlreadyExist = await datasource
        .getRepository(Url)
        .findOneBy({ url: urlFormatted });

      if (urlAlreadyExist === null) {
        console.log("DO NOT EXIST");
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
        console.log("EXIST");
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
}
