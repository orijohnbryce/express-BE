import express, { NextFunction, Request, Response } from "express";
import { appConfig } from "../utils/config";
import { createOrder, getOrder } from "../services/order-service";
import { verifyTokenMW } from "../middlewares/auth-middleware";
import OrderModel from "../models/order-model";
import { UnknownError } from "../models/exceptions";
import { StatusCode } from "../models/status-enum";

export const orderRouter = express.Router();

// get order (by id)
orderRouter.get(
  appConfig.routsPrefix + "order/:id",

  // verifyTokenMW,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const order: OrderModel = await getOrder(+request.params.id);

      // todo: make sure the authed user is the user inside the order

      response.json(order);
    } catch (error) {
      next(error);
    }
  }
);

// create order
orderRouter.post(
  appConfig.routsPrefix + "order",
  verifyTokenMW,
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const productList = request.body.productList;
      const comments = request.body.comments;
      const date = request.body.date ? request.body.date : new Date();
      await createOrder(response.locals.user, date, comments, productList);
      response.status(StatusCode.Created).json("created");
    } catch (error) {
      throw new UnknownError(error);
    }
  }
);
