import express, { NextFunction, Request, Response } from "express";
import { initDB } from "../db/initDB";
import { appConfig } from "../utils/config";
import { UnknownError } from "../models/exceptions";

export const dbRouter = express.Router();

dbRouter.post(
  appConfig.routsPrefix + "init-db",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providedPassword = req.body.password;

      if (!process.env.INIT_DB_PW) {
        res.status(500).json({ message: "Server configuration error" });
      }

      console.log("DBG initDB:", providedPassword, process.env.INIT_DB_PW);
      
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
