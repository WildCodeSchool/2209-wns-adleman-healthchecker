import Url from "../entity/Url";
import { IResponse } from "../interface/IResponse";
import Response from "../entity/Response";
import datasource from "../database";
import { ApolloError } from "apollo-server-errors";
import User from "../entity/User";
import UserToUrl from "../entity/UserToUrl";
export class UrlService {
  checkIfUrlIsValid(url: string): boolean {
    const urlPattern =
      /^(https?:\/\/|)(?:www\.|(?!www))([a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]{2,}\.[^\s]{2,}|www\.[a-zA-Z0-9]{2,}\.[^\s]{2,})/;

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
      // user.userToUrls = [...user.userToUrls, newUrlCreated];

      // await datasource.getRepository(User).save(user);

      await datasource.getRepository(UserToUrl).save({
        userId: user.id,
        urlId: newUrlCreated.id,
        frequency: 3600000,
      });
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

    if (user !== null && urlAlreadyExistWithResponses !== null) {
      // user.urls = [...user.urls, urlAlreadyExist];

      // await datasource.getRepository(User).save(user);
      const existingUserToUrl = await datasource
        .getRepository(UserToUrl)
        .findOne({
          where: {
            userId: user.id,
            urlId: urlAlreadyExistWithResponses.id,
          },
        });

      if (existingUserToUrl === null)
        await datasource.getRepository(UserToUrl).save({
          userId: user.id,
          urlId: urlAlreadyExistWithResponses.id,
          frequency: 3600000,
        });
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

  hasToBeFetched = (freq: number, lastresp: number): boolean => {
    const now = new Date().getTime();
    return now - lastresp > freq;
  };

  async periodicFetchUrl(): Promise<void> {
    const urlService = new UrlService();
    const interval = 5000;

    const update = async (): Promise<void> => {
      const _urls = await datasource
        .getRepository(Url)
        .find({ relations: ["userToUrls"] });

      const urls = await Promise.all(
        _urls.map(async (u: Url) => {
          const response = await datasource
            .getRepository(Response)
            .find({ where: { urlId: u.id }, take: 1, order: { id: "DESC" } });
          return { ...u, response };
        })
      );

      urls.forEach(async (url) => {
        let minFrequency = 3600000;
        if (url.userToUrls.length > 0)
          minFrequency = url.userToUrls.sort(
            (a, b) => a.frequency - b.frequency
          )[0].frequency;
        if (minFrequency !== url.frequency) {
          url.frequency = minFrequency;
          await datasource.getRepository(Url).save(url);
        }

        const lastResSecond = url.response[0].created_at.getTime();

        if (this.hasToBeFetched(minFrequency, lastResSecond)) {
          console.log(`${url.url} IS FETCHED`);
          await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
        }
      });
    };
    setInterval(update, interval);
  }
}
