import { NextFunction, Request, Response, Router } from "express";
import UserModel from "../models/user-model";
import { createUser, login } from "../services/auth-service";
import { StatusCode } from "../models/status-enum";
import { ValidationError } from "../models/exceptions";
import { appConfig } from "../utils/config";


const authRouter = Router();

// add new user
authRouter.post(
  "/api/v1/user",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const um = new UserModel(req.body);

      const token = await createUser(um);
      res.status(StatusCode.Created).json(token);
    } catch (error: any) {
      if (error?.message?.includes("UNIQUE constraint failed: user.email")) {
        next(new ValidationError("Email already taken."));
      } else next(error);
    }
  }
);

// login - create token
authRouter.post(
  appConfig.routsPrefix + "user/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await login(req.body.email, req.body.password);
      res.status(StatusCode.Ok).json(token);
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;