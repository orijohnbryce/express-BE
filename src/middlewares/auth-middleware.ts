import { NextFunction, Request, Response } from "express";
import { verifyToken as vt } from "../utils/auth-utils";


export function verifyTokenMW(req: Request, res: Response, next: NextFunction) {
    try {          
        const token = req.header("Authorization")?.substring(7);                         
        const user = vt(token);
        res.locals.user = user;                
        next()
    } catch (error) {
        next(error)
    }
}

export function verifyTokenAdminMW(req: Request, res: Response, next: NextFunction) {
    try {          
        const token = req.header("Authorization")?.substring(7);                         
        vt(token, true);
        next()
    } catch (error) {
        next(error)
    }
}