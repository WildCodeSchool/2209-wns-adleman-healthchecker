import Url from "../entity/Url";
import { IResponse } from "../interface/IResponse";
import Response from "../entity/Response";
import datasource from "../database";
import { ApolloError } from "apollo-server-errors";
import User from "../entity/User";
export class UrlService {
  async checkIfUrlIsValid(url: string): Promise<boolean> {
    const urlPattern =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

    const reg = new RegExp(urlPattern);

    if (reg.test(url)) {
      return true;
    } else {
      return false;
    }
  }

  async formatUrl(url: string): Promise<URL> {
    let urlInLowerCase = url.toLowerCase();
    const formatUrlWithoutProtocolPattern = /^(?!https?).*$/;
    const formatUrlWithoutPrefixPattern = /(https?:\/\/(?!www).*$)/;
    const formatUrlWithSecureProtocolPattern = /^https:\/\/.*$/;

    const reg = new RegExp(formatUrlWithoutProtocolPattern);

    if (reg.test(urlInLowerCase)) {
      urlInLowerCase = `http://${urlInLowerCase}`;
    }

    const reg2 = new RegExp(formatUrlWithoutPrefixPattern);

    if (reg2.test(urlInLowerCase)) {
      urlInLowerCase = urlInLowerCase.replace(
        /^([a-zA-Z][a-zA-Z0-9.+-]*):\/\//,
        "$1://www."
      );
    }

    const reg3 = new RegExp(formatUrlWithSecureProtocolPattern);

    if (reg3.test(urlInLowerCase)) {
      urlInLowerCase = urlInLowerCase.replace(/^https:\/\//i, "http://");
    }

    const urlFormatted = new URL(urlInLowerCase);
    return urlFormatted;
  }

  async getResponse(url: string): Promise<IResponse> {
    let latency, stop, response, status;
    const start = new Date().getTime();
    try {
      response = await fetch(url);
      status = response.status;
    } catch (error) {
      console.error(error);
      status = null;
    } finally {
      stop = new Date().getTime();
      latency = stop - start;
    }
    return {
      latency,
      response_status: status,
    };
  }

  async saveResponseForNewUrlAndGetResponses(
    urlFormatted: string,
    responseForNewUrl: IResponse,
    user: User | null
  ): Promise<Url> {
    const newUrlCreated = await datasource
      .getRepository(Url)
      .save({ url: urlFormatted });

    if (responseForNewUrl.response_status === null) {
      throw new ApolloError(`Error while getting response for url`);
    }

    await datasource.getRepository(Response).save({
      urlId: newUrlCreated.id,
      response_status: responseForNewUrl.response_status,
      latency: responseForNewUrl.latency,
    });

    const urlWithResponses = await datasource.getRepository(Url).findOne({
      where: { id: newUrlCreated.id },
      relations: ["responses"],
    });

    if (user !== null) {
      user.urls = [...user.urls, newUrlCreated];

      await datasource.getRepository(User).save(user);
    }

    if (urlWithResponses === null)
      throw new ApolloError(
        `Error while searching responses for url : ${urlFormatted}`
      );

    return urlWithResponses;
  }

  async saveAndGetResponsesFromExistingUrl(
    urlAlreadyExist: Url,
    getResponseForExistingUrl: IResponse,
    user: User | null
  ): Promise<Url> {
    if (getResponseForExistingUrl.response_status === null) {
      throw new ApolloError(`Error while getting response for url`);
    }
    await datasource.getRepository(Response).save({
      urlId: urlAlreadyExist.id,
      response_status: getResponseForExistingUrl.response_status,
      latency: getResponseForExistingUrl.latency,
    });

    const urlAlreadyExistWithResponses = await datasource
      .getRepository(Url)
      .findOne({
        where: { id: urlAlreadyExist.id },
        relations: ["responses"],
      });

    if (user !== null) {
      user.urls = [...user.urls, urlAlreadyExist];

      await datasource.getRepository(User).save(user);
    }

    if (urlAlreadyExistWithResponses === null)
      throw new ApolloError(
        `Error while searching responses for url : ${urlAlreadyExist.url}`
      );

    return urlAlreadyExistWithResponses;
  }

  async getAndSaveResponseForEachUrl(
    url: string,
    urlId: number
  ): Promise<Response> {
    let latency, stop, response, status, responseForUrl;
    const start = new Date().getTime();
    try {
      response = await fetch(url);
      status = response.status;
    } catch (error) {
      console.error(error);
      status = null;
    } finally {
      stop = new Date().getTime();
      latency = stop - start;
    }
    if (status === null) {
      responseForUrl = await datasource.getRepository(Response).save({
        urlId,
        response_status: 404,
        latency,
      });
    } else {
      responseForUrl = await datasource.getRepository(Response).save({
        urlId,
        response_status: status,
        latency,
      });
    }
    return responseForUrl;
  }
}
