import { runQuery } from "../db/dal";
import { NotFoundError } from "../models/exceptions";
import OrderModel from "../models/order-model";
import { OrderProductModel } from "../models/order-product-model";
import UserModel from "../models/user-model";

export async function getOrder(id: number) {
  const orderRes: OrderModel[] = await runQuery(
    'select * from "order" where id=?;',
    [id]
  );
  if (orderRes.length !== 1) {
    throw new NotFoundError("order not found!");
  }
  const order = orderRes[0];

  const products = await runQuery(
    'select productId, quantity from "order_product" where orderId=?',
    [id]
  );
  const productObjects = products.map((p) => {
    return { productId: p.productId, orderId: p.orderId, quantity: p.quantity };
  });
  const orderObj = new OrderModel(
    order.userId,
    productObjects,
    order.date,
    order.comments,
    order.id
  );
  return orderObj;
}

export async function createOrder(
  user: UserModel,
  date: Date,
  comments: string,
  productsQuantity: { id: number; quantity: number }[]
) {
  const order = new OrderModel(user.id, [], date, comments);
  const { q, params } = order.getInsertQuery();
  const res = await runQuery(q, params);

  // create order_product records
  for (let index = 0; index < productsQuantity.length; index++) {
    // todo: make sure product exists!

    const pq = productsQuantity[index];
    const op = new OrderProductModel(order, pq.id, pq.quantity);
    const { q, params } = op.getInsertQuery();
    await runQuery(q, params);
  }

  return res;
}

export async function deleteOrder(order: OrderModel) {
  // order.validate();
  // make sure order is registered on the same auth-user

  // delete all order_products records
  const query = `delete from order_product where orderId=?`;
  const param = [order.id];
  await runQuery(query, param);

  // delete order record
  const { q, params } = order.getDeleteQuery();
  await runQuery(q, params);
}
