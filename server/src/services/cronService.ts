import datasource from "../database";
import Url from "../entity/Url";
import { UrlService } from "./UrlService";
import Response from "../entity/Response";

export async function sendNewRequestToAllUrls(): Promise<Response[]> {
  const urlService = new UrlService();
  const urls = await datasource.getRepository(Url).find();

  const responseForAllUrls = await Promise.all(
    urls.map(async (url) => {
      return await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
    })
  );
  console.log("All urls has been fetched");

  return responseForAllUrls;
}
