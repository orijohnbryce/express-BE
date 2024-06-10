import path from "path";

// import { URL } from 'url';
// const __dirname = new URL('.', import.meta.url).pathname;

class AppConfig {
  readonly port = 4000; // default port is 3030
  readonly logFile = path.join(__dirname, "./../log.log");
  readonly routsPrefix = "/api/v1/";
  readonly tokenSecreteKey = "just-example-for-secrete-key"; // todo: move to env
}

export const appConfig = new AppConfig();
