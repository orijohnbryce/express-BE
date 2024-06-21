import express, { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { appConfig } from "../utils/config";
import { saveImage } from "../utils/image-helpers";
import { UploadedFile } from "express-fileupload";


export const imageRouter = express.Router();

imageRouter.post(
  appConfig.routsPrefix + "images",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file: any = req.files['my-image'];
      const imageName = await saveImage(file);
      
      res.json(imageName);
    } catch (error) {
        next(error);
    }
  }
);

imageRouter.get(
  appConfig.routsPrefix + "images/:imageName",
  async (req: Request, res: Response, next: NextFunction) => {        
    res.sendFile(appConfig.imagesPath + req.params.imageName);    
  }
)
