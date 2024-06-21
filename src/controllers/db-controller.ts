import express, { NextFunction, Request, Response } from "express";
import { initDB } from "../db/initDB";
import { appConfig } from "../utils/config";
import { verifyTokenAdminMW } from "../middlewares/auth-middleware";

export const dbRouter = express.Router();

dbRouter.post(
  appConfig.routsPrefix + "init-db",
  verifyTokenAdminMW,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providedPassword = req.body.password;

      if (!process.env.INIT_DB_PW) {
        res.status(500).json({ message: "Server configuration error" });
      }
      
      // Double Secure Check.
      // Compare provided password with the environment variable
      if (providedPassword === process.env.INIT_DB_PW) {
        await initDB();
        res.status(200).json({ message: "DB initialized!" });
      } else {
        res.status(401).json({ message: "Password is incorrect" });
      }
    } catch (error: any) {
        next(error);
    }
  }
);
