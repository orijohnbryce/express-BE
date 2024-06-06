import path from "path";

class AppConfig {
  readonly port = 4000; // default port is 3030
  readonly logFile = path.join(__dirname, "./../log.log");
  readonly routsPrefix = "/api/v1/";
  readonly tokenSecreteKey = "just-example-for-secrete-key"; // todo: move to env
}

export const appConfig = new AppConfig();
