import { Response, Request } from "express";

const read = async (req: Request, res: Response) => {
  const randomNumber = Math.random() * 100;
  const randomLatency = Math.random() * 5000;

  const sendStatus =
    randomNumber < 80
      ? 200
      : randomNumber > 80 && randomNumber < 90
      ? 400
      : 500;
      
      console.log(`statut de la requête: ${sendStatus}`);
  setTimeout(() => {
    return res.status(sendStatus).send("Hello World!");
  }, randomLatency);

};
export default read;
