import { Router } from "express";

const userRoute = (): any => {
  const router = Router();

  router.post("/users");

  return router;
};

export { userRoute };
