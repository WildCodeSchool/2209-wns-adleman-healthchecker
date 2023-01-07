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

  @Mutation(() => Url)
  async createUrl(@Arg("url") url: createUrlInput): Promise<Url> {
    const urlService = new UrlService();

    const urlValid = await urlService.checkIfUrlIsValid(url.url);
    if (!urlValid) throw new ApolloError("Url is not valid");

    const urlWithNewFormat = await urlService.formatUrl(url.url);
    const { href: urlFormatted } = urlWithNewFormat;

    const urlAlreadyExist = await datasource
      .getRepository(Url)
      .findOneBy({ url: urlFormatted });

    if (urlAlreadyExist === null) {
      const newUrlCreated = await datasource
        .getRepository(Url)
        .save({ url: urlFormatted });

      const responseWithNewUrlCreated = await urlService.getResponseForUrl(
        urlFormatted,
        newUrlCreated.id
      );

      await datasource.getRepository(Response).save({
        urlId: newUrlCreated.id,
        response_status: responseWithNewUrlCreated.response_status,
        latency: responseWithNewUrlCreated.latency,
      });

      const urlWithResponses = await datasource.getRepository(Url).findOne({
        where: { id: responseWithNewUrlCreated.id },
        relations: ["responses"],
      });

      if (urlWithResponses === null)
        throw new ApolloError("Error while saving new Url");

      return urlWithResponses;
    } else {
      const responseFromExistingUrl = await urlService.getResponseForUrl(
        urlFormatted,
        urlAlreadyExist.id
      );

      await datasource.getRepository(Response).save({
        urlId: urlAlreadyExist.id,
        response_status: responseFromExistingUrl.response_status,
        latency: responseFromExistingUrl.latency,
      });

      const urlAlreadyExistWithResponses = await datasource
        .getRepository(Url)
        .findOne({
          where: { id: responseFromExistingUrl.id },
          relations: ["responses"],
        });

      if (urlAlreadyExistWithResponses === null)
        throw new ApolloError(
          "Error while getting responses from existing Url"
        );

      return urlAlreadyExistWithResponses;
    }
  }
}
