import express, { Request, Response, NextFunction } from "express";
import { initDB } from "./db/initDB";
import expressFileUpload from "express-fileupload";
import productRouter from "./controllers/product-controller";
import authRouter from "./controllers/auth-controller";
import { isDbSeverUp, logError } from "./utils/helpers";
import { appConfig } from "./utils/config";
import { AppException, NotFoundError } from "./models/exceptions";
import { orderRouter } from "./controllers/order-controller";
import { imageRouter } from "./controllers/image-controller";
import { dbRouter } from "./controllers/db-controller";
import { boolean } from "joi";

// create rest-api app
const app = express();

// log
app.use("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} Call: ${req.url}`);

  next();
});

// load body and files
app.use(express.json());
app.use(expressFileUpload()); // config file could be added here, with maxSize etc

// add controllers
app.use("/", productRouter);
app.use("/", authRouter);
app.use("/", orderRouter);
app.use("/", imageRouter);
app.use("/", dbRouter); // let init-db by http request

// if route not found:
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  // (using "/" is same as "*", but less clear)

  //   res.status(400).send("No rout found");
  throw new NotFoundError(`Route ${req.url} not exists`);
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
});

// init db if needed.
// WARNING: initDb is async function.
// initDB()

isDbSeverUp().then((isUp: boolean) => {
  if (!isUp) {
    console.log("DB server is down. app will not start.");
    return;
  } else {
    console.log("DB server is up. starting App");
    
    app.listen(appConfig.port, () => {
      console.log(
        `\n\nStart listening on:\nhttp://localhost:${appConfig.port}/`
      );

      console.log(`
    End-points:
    POST localhost:${appConfig.port}/api/v1/products
    GET localhost:${appConfig.port}/api/v1/products
    GET localhost:${appConfig.port}/api/v1/products/:id
    POST localhost:${appConfig.port}/api/v1/user
    POST localhost:${appConfig.port}/api/v1/user/login
    GET localhost:${appConfig.port}/api/v1/order/:id
    POST localhost:${appConfig.port}/api/v1/order
          `);
    });
  }
});
