import { runQuery } from "../db/dal";
import ProductModel from "../models/product-model";
import Product from "../models/product-model";
import { ValidationError } from "../models/exceptions";

export async function addProduct(p: Product): Promise<void> {
  p.validate();
  const q = `INSERT INTO product ("name", "price") values (?, ?)`;
  const qParams = [p.name, p.price];
  await runQuery(q, qParams);  
}

export async function getProducts(id: number = -1): Promise<ProductModel[]> {
  if (typeof id !== "number" || isNaN(id)) {
    throw new ValidationError("Id must me number!");
  }

  const q =
    id !== -1
      ? `select * from product where id=?`
      : "select * from product";
  const qParams = [id]
  const res = await runQuery(q, qParams);
  const products = res.map((p) => new ProductModel(p));
  return products;
}
