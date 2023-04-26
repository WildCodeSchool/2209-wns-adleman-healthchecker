import datasource from "../database";
import Url from "../entity/Url";
import { UrlService } from "./UrlService";
import Response from "../entity/Response";
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
// export default async function startCron(): Promise<void> {
//   // Get All Urls

//   // For each URL get All UserToUrl
//   // and get the lower frequency

//   // setInterval for each Url with lower frequency
//   const urls = await datasource
//     .getRepository(Url)
//     .find({ relations: { userToUrls: true } });

//   urls.forEach((url) => {
//     if (url.userToUrls.length > 0) {
//       const min = url.userToUrls.sort((a, b) => a.frequency - b.frequency)[0];

//       setInterval(async () => {
//         const urlService = new UrlService();
//         await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
//       }, min.frequency);
//     } else {
//       setInterval(async () => {
//         const urlService = new UrlService();
//         await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
//       }, 3600000);
//     }
//   });
// }

const hasToBeFetched = (freq: number, lastresp: number): boolean => {
  const now = new Date().getTime();
  // console.log("now", now / 1000);
  // console.log("lastresp", lastresp / 1000);
  console.log(`${now / 1000 - lastresp / 1000}`);
  console.log(freq);
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
      const lastResponse = url.responses
        .sort(
          (a: Response, b: Response) =>
            a.created_at.getTime() - b.created_at.getTime()
        )[0]
        .created_at.getTime();
      console.log(url.url);
      // console.log(
      //   `${
      //     url.url
      //   } > frequency : ${minFrequency} / ${lastResponse}: hastobeFetched : ${
      //     hasToBeFetched(minFrequency, lastResponse) ? "true" : "false"
      //   }`
      // );
      if (hasToBeFetched(minFrequency, lastResponse)) {
        await urlService.getAndSaveResponseForEachUrl(url.url, url.id);
      }
    });
  };
  setInterval(update, interval);
}
