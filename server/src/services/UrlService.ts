import IResponse from "../interface/IResponse";

export class UrlService {
  async getResponse(url: string): Promise<IResponse> {
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
      latency,
      response_status: status,
    };
  }
}
