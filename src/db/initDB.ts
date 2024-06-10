import fs from "fs";
import { runQuery } from "./dal";
import path from "path";

// import { URL } from 'url';
// const __dirname = new URL('.', import.meta.url).pathname;

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

  const createOrder = `CREATE TABLE \`order\` (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER,
          date TEXT,
          comments TEXT,
          FOREIGN KEY(userId) REFERENCES user(id)
          )`;

  const createOrderProduct = `CREATE TABLE order_product (
          orderId INTEGER,
          productId INTEGER,
          quantity INTEGER,
          PRIMARY KEY (orderId, productId),
          FOREIGN KEY(orderId) REFERENCES \`order\`(id),
          FOREIGN KEY(productId) REFERENCES product(id)
          )`;

  await runQuery(createProduct);
  await runQuery(createUser);
  await runQuery(createOrder);
  await runQuery(createOrderProduct);

  // create demo data:
  let q = "insert into product(name, price) values ('Coke', 12);";
  await runQuery(q);
  q = "insert into product(name, price) values ('Computer', 1200);";
  await runQuery(q);
  q = "insert into product(name, price) values ('Tree', 35);";
  await runQuery(q);

  q = "insert into user(username, email, password, isAdmin) values ('admin', 'admin@example.com', 'password', true);";
  await runQuery(q);
  q = "insert into user(username, email, password) values ('user1', 'user1@example.com', 'password');";
  await runQuery(q);
  q = "insert into user(username, email, password) values ('user2', 'user2@example.com', 'password');";
  await runQuery(q);

  q = "insert into `order`(userId, date, comments) values (2, '2024-06-09', 'please hurry');";
  await runQuery(q);
  q = "insert into order_product(orderId, productId, quantity) values (1, 1, 2);";
  await runQuery(q);
  q = "insert into order_product(orderId, productId, quantity) values (1, 3, 1);";
  await runQuery(q);

  console.log("DB initialized successfully");
}
