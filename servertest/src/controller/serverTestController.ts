import { Response, Request } from "express";

const read = async (req: Request, res: Response) => {
  const randomNumber = Math.random() * 100;

  const sendStatus =
    randomNumber < 80
      ? 200
      : randomNumber > 80 && randomNumber < 90
      ? 400
      : 500;

  console.log(`statut de la requête: ${sendStatus}`);
  return res.status(sendStatus).send("Hello World!");
};
export default read;
