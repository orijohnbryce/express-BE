import fs from "fs";
import { runQuery } from "./dal";
import path from "path";

export async function initDB(force = true) {
  const dbPath = path.resolve(__dirname, "./sqlite.db");
  if (fs.existsSync(dbPath)) {
    if (!force) {
      console.log("skipping init DB");
      return;
    } else {
      // enforce recreation
      fs.rmSync(dbPath);
    }
  }

  console.log("initialing DB");

  let createProduct = `CREATE TABLE product 
        (            
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL
        )`;
  const createUser = `CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,        
        username TEXT NOT NULL,
        email TEXT UNIQUE,        
        password TEXT,
        isAdmin BOOLEAN DEFAULT false,
        token TEXT)`;

  await runQuery(createProduct);

  await runQuery(createUser);

  // create demo data:
  let q = "insert into product(name, price) values ('Coke', 12);";
  await runQuery(q);
  q = "insert into product(name, price) values ('Computer', 1200);";
  await runQuery(q);
  q = "insert into product(name, price) values ('Tree', 35);";
  await runQuery(q);

  console.log("DB initialized successfully");
}
