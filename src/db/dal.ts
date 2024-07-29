import mysql from "mysql2";
import { appConfig } from "../utils/config";

const connection = mysql.createPool({
  host: appConfig.dbConfig.host,
  user: appConfig.dbConfig.user,
  password: appConfig.dbConfig.password,
  database: appConfig.dbConfig.database,
  port: appConfig.dbConfig.port, // also default
});

function runQuery(queryString: string, qParams: any[] = []): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    connection.query(queryString, qParams, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

export { runQuery }; // then use dal.execute()
