import express, { Request, Response, NextFunction } from "express";
import { initDB } from "./db/initDB";
import productRouter from "./controllers/product-controller";
import authRouter from "./controllers/auth-controller";
import { logError } from "./utils/helpers";
import { appConfig } from "./utils/config";
import { AppException, NotFoundError } from "./models/exceptions";

// create rest-api app
const app = express();

// log
app.use("/", async (req: Request, res: Response, next: NextFunction) => {    
    console.log(`${req.method} Call: ${req.url}`);
    
  next();
});

// load body
app.use(express.json());

// add controllers
app.use("/", productRouter);
app.use("/", authRouter);

// if route not found:
app.use("/", (req: Request, res: Response, next: NextFunction) => {
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

// init db if needed  (arg="true" means init anyway)
initDB(false).then(() => {
  app.listen(appConfig.port, () => {
    console.log(
      `\n\nStart listening on:\nhttp://localhost:${appConfig.port}/\n\n`
    );
  });
});