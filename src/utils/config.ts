import path from "path";

class AppConfig {
  readonly port = 4000; // default port is 3030
  readonly logFile = path.join(__dirname, "./../log.log");
  readonly routsPrefix = "/api/v1/";
  readonly tokenSecreteKey = "just-example-for-secrete-key"; // todo: move to env var

  // Configuration for the MySQL database connection
  readonly dbConfig = {
    host: "localhost", // Replace with your MySQL server host
    user: "ori", // Replace with your MySQL username
    password: "password", // Replace with your MySQL password
    database: "oridb", // Replace with your MySQL database name
    port: 3306, // default if 3306
  };
}

export const appConfig = new AppConfig();
