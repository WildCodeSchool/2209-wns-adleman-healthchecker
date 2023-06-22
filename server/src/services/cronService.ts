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

      if (hasToBeFetched(minFrequency, lastResSecond)) {
        console.log(`${url.url} IS FETCHED`);
        await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
      }
    });
  };
  setInterval(update, interval);
}
