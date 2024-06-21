import express, { NextFunction, Request, Response } from "express";
import { addProduct, getProducts } from "../services/products-service";
import ProductModel from "../models/product-model";
import { appConfig } from "../utils/config";
import { StatusCode } from "../models/status-enum";
import {  verifyTokenMW } from "../middlewares/auth-middleware";


const productRouter = express.Router();

// add new product - only for auth user
productRouter.post(
  appConfig.routsPrefix + "products",
  verifyTokenMW,  
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addProduct(new ProductModel(req.body));
      res.status(StatusCode.Created).json("created");
    } catch (error) {
      next(error);
    }
  }
);

productRouter.get(
  appConfig.routsPrefix + "products",
  async (request: Request, response: Response, next: NextFunction) => {      
    try {
      const products = await getProducts();
      response.json(products);
    } catch (error) {
      next(error);
    }
  }
);

productRouter.get(
  appConfig.routsPrefix + "products/:id",    
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const products = await getProducts(+request.params.id);
      if (products.length === 0) {
        response.json("ID Not Found");
      }
      response.json(products[0]);
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
