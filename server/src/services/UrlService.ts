import IResponse from "../interface/IResponse";

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

  async getResponseForUrl(url: string, id: number): Promise<IResponse> {
    let latency, stop, res, status;
    const start = new Date().getTime();

    try {
      res = await fetch(url);
      status = res.status;
    } catch (error) {
      status = 404;
    } finally {
      stop = new Date().getTime();
      latency = stop - start;
    }

    return {
      id,
      latency,
      response_status: status,
    };
  }
}
