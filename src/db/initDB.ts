import { runQuery } from "./dal";

export async function initDB() {
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
