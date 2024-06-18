import { runQuery as runQuerySqlite } from "./sqlite";
import { runQuery as runQueryMySql } from "./mysql";
import { appConfig } from "../utils/config";

export const runQuery =
  appConfig.dbEngine === "mysql" ? runQueryMySql : runQuerySqlite;
