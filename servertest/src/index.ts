import express from "express";
import read from "./controller/serverTestController";

const app = express();

app.use(express.json());

app.get("/servertest/", read);

const start = async () => {
  app.listen(9000, () => {
    console.log("listening on port 9000");
  });
};

start();
