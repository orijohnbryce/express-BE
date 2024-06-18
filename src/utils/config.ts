import path from "path";

class AppConfig {
  readonly port = 4000; // default port is 3030
  readonly logFile = path.join(__dirname, "./../log.log");
  readonly routsPrefix = "/api/v1/";
  readonly tokenSecreteKey = "just-example-for-secrete-key"; // todo: move to env
  readonly dalFile = path.join(__dirname, "./../db/dal_mysql.ts");
  readonly dbEngine = "mysql"; // could be depends on ENV

  // Configuration for the MySQL database connection
  readonly dbConfig = {
    host: "localhost", // Replace with your MySQL server host
    user: "root", // Replace with your MySQL username
    password: "", // Replace with your MySQL password
    database: "ori_db", // Replace with your MySQL database name
  };
}

export const appConfig = new AppConfig();
