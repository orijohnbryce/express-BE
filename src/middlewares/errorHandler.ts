import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/helpers";
import { AppException } from "../models/exceptions";

const catchAll = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    `Error ${err.constructor.name} caught by catchAll:  ${err?.message}`
  );

  logError(err, req); // async. you can choose to await on it

  const status = err.status || 500;

  if (err instanceof AppException) {
    res.status(status).send(err.message);
  } else {
    // don't expose unknown errors to user
    res.status(status).send("Something is broken!");
  }
};

export default catchAll;
