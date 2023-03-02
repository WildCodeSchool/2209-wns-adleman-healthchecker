import User from "../entity/User";
import jwt from "jsonwebtoken";
import express from "express";
import { env } from "../environment";
import datasource from "../database";
export interface ContextType {
  req: express.Request;
  res: express.Response;
  currentUser?: User;
  jwtPayload?: jwt.JwtPayload;
}

const customAuthChecker = async (
  { context }: { context: ContextType },
  roles: any[]
): Promise<boolean> => {
  const tokenInHeaders = context.req.headers.authorization?.split(" ")[1];
  const tokenInCookie = context.req.cookies?.token;
  const token = tokenInHeaders ?? tokenInCookie;

  console.log({ tokenInCookie, tokenInHeaders });

  try {
    let decoded;
    // https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    if (typeof token !== "undefined")
      decoded = jwt.verify(token, env.JWT_PRIVATE_KEY);
    if (typeof decoded === "object") context.jwtPayload = decoded;
  } catch (err) {}

  let user = null;
  if (context.jwtPayload !== null && typeof context.jwtPayload !== "undefined")
    user = await datasource
      .getRepository(User)
      .findOne({ where: { id: context.jwtPayload.userId } });

  if (context.req.body.operationName === "createUrl" && token === undefined) {
    return true;
  }

  if (user === null) return false;

  context.currentUser = user;
  return roles.length === 0 || roles.includes(user.role);
};

export default customAuthChecker;
