import datasource from "../database";
import Url from "../entity/Url";
import { UrlService } from "./UrlService";
import Response from "../entity/Response";

const hasToBeFetched = (freq: number, lastresp: number): boolean => {
  const now = new Date().getTime();
  return now - lastresp > freq;
};

export default async function startCron(): Promise<void> {
  const urlService = new UrlService();
  const interval = 5000;
  const update = async (): Promise<void> => {
    const urls = await datasource
      .getRepository(Url)
      .find({ relations: ["userToUrls", "responses"] });

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
      const lastResponse = url.responses.sort(
        (a: Response, b: Response) =>
          b.created_at.getTime() - a.created_at.getTime()
      )[0].created_at;
      const lastResSecond = lastResponse.getTime();
      if (hasToBeFetched(minFrequency, lastResSecond)) {
        console.log(`${url.url} IS FETCHED`);
        await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
      }
    });
  };
  setInterval(update, interval);
}
