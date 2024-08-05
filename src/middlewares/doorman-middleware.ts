import { NextFunction, Request, Response } from "express";
import { appConfig } from "../utils/config";
import { StatusCode } from "../models/status-enum";


// only our FE app will have the key, which should be renew from time to time.
function doorman(req: Request, res: Response, next: NextFunction) {    
    if (req.header("doormanKey") !== appConfig.doormanKey) {
        res.status(StatusCode.Unauthorized).send("You are not authorized! (doorman)");
        return;
    }    
    next();  
}

export default doorman;