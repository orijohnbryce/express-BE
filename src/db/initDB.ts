import { appConfig } from "../utils/config";
import fs from "fs";
import { runQuery } from "./dal";
import path from "path";

export const initDB = (force = true) => {
  if (appConfig.dbEngine === "mysql") {
    initDBMySql();
  } else {
    initDBSqlite(force);
  }
};

async function initDBMySql() {
  console.log("initializing DB");

  // Drop tables
  await runQuery("DROP TABLE IF EXISTS order_product;");
  await runQuery("DROP TABLE IF EXISTS `order`;");
  await runQuery("DROP TABLE IF EXISTS user;");
  await runQuery("DROP TABLE IF EXISTS product;");

  let createProduct = `CREATE TABLE product 
        (            
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        price DECIMAL(10, 2)
        )`;
  const createUser = `CREATE TABLE user (
        id INT PRIMARY KEY AUTO_INCREMENT,        
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,        
        password VARCHAR(255),
        isAdmin BOOLEAN DEFAULT false,
        token TEXT)`;

  const createOrder = `CREATE TABLE \`order\` (
          id INT PRIMARY KEY AUTO_INCREMENT,
          userId INT,
          date DATE,
          comments TEXT,
          FOREIGN KEY(userId) REFERENCES user(id)
          )`;

  const createOrderProduct = `CREATE TABLE order_product (
          orderId INT,
          productId INT,
          quantity INT,
          PRIMARY KEY (orderId, productId),
          FOREIGN KEY(orderId) REFERENCES \`order\`(id),
          FOREIGN KEY(productId) REFERENCES product(id)
          )`;

  await runQuery(createProduct);
  await runQuery(createUser);
  await runQuery(createOrder);
  await runQuery(createOrderProduct);

  // create demo data:
  let q = "INSERT INTO product(name, price) VALUES ('Coke', 12);";
  await runQuery(q);
  q = "INSERT INTO product(name, price) VALUES ('Computer', 1200);";
  await runQuery(q);
  q = "INSERT INTO product(name, price) VALUES ('Tree', 35);";
  await runQuery(q);

  q =
    "INSERT INTO user(username, email, password, isAdmin) VALUES ('admin', 'admin@example.com', 'password', true);";
  await runQuery(q);
  q =
    "INSERT INTO user(username, email, password) VALUES ('user1', 'user1@example.com', 'password');";
  await runQuery(q);
  q =
    "INSERT INTO user(username, email, password) VALUES ('user2', 'user2@example.com', 'password');";
  await runQuery(q);

  q =
    "INSERT INTO `order`(userId, date, comments) VALUES (2, '2024-06-09', 'please hurry');";
  await runQuery(q);
  q =
    "INSERT INTO order_product(orderId, productId, quantity) VALUES (1, 1, 2);";
  await runQuery(q);
  q =
    "INSERT INTO order_product(orderId, productId, quantity) VALUES (1, 3, 1);";
  await runQuery(q);

  console.log("DB initialized successfully");
}

async function initDBSqlite(force = true) {
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

  q =
    "insert into user(username, email, password, isAdmin) values ('admin', 'admin@example.com', 'password', true);";
  await runQuery(q);
  q =
    "insert into user(username, email, password) values ('user1', 'user1@example.com', 'password');";
  await runQuery(q);
  q =
    "insert into user(username, email, password) values ('user2', 'user2@example.com', 'password');";
  await runQuery(q);

  q =
    "insert into `order`(userId, date, comments) values (2, '2024-06-09', 'please hurry');";
  await runQuery(q);
  q =
    "insert into order_product(orderId, productId, quantity) values (1, 1, 2);";
  await runQuery(q);
  q =
    "insert into order_product(orderId, productId, quantity) values (1, 3, 1);";
  await runQuery(q);

  console.log("DB initialized successfully");
}
