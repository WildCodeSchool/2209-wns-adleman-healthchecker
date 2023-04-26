import datasource from "../database";
import Url from "../entity/Url";
import { UrlService } from "./UrlService";
// import { UrlService } from "./UrlService";
// import Response from "../entity/Response";

// export async function sendNewRequestToAllUrls(): Promise<Response[]> {
//   const urlService = new UrlService();
//   const urls = await datasource.getRepository(Url).find();

//   const responseForAllUrls = await Promise.all(
//     urls.map(async (url) => {
//       return await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
//     })
//   );
//   console.log("All urls has been fetched");

//   return responseForAllUrls;
// }
export default async function startCron(): Promise<void> {
  // Get All Urls

  // For each URL get All UserToUrl
  // and get the lower frequency

  // setInterval for each Url with lower frequency
  const urls = await datasource
    .getRepository(Url)
    .find({ relations: { userToUrls: true } });

  urls.forEach((url) => {
    if (url.userToUrls.length > 0) {
      const min = url.userToUrls.sort((a, b) => a.frequency - b.frequency)[0];

      setInterval(async () => {
        const urlService = new UrlService();
        await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
      }, min.frequency);
    } else {
      setInterval(async () => {
        const urlService = new UrlService();
        await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
      }, 3600000);
    }
  });
}
