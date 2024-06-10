import OrderModel from "./order-model";
import ProductModel from "./product-model";

export class OrderProductModel {
    order: OrderModel;
    productId: number;
    quantity: number;

    constructor(order: OrderModel, productId: number, quantity: number=1) {
        this.order = order;        
        this.productId = productId;
        this.quantity = quantity;
    }

    getInsertQuery() {
        const q = `insert into order_product (orderId, productId, quantity) 
                values (?, ?, ?);`;
        const params = [this.order.id, this.productId, this.quantity];
        
        return {q, params};
    }

    static getById(id: number) {
        const q = `select * from order_product where id=?`;
        const params = [id]
    }

    getUpdateQuery() {
        const q = `update order_product set quantity=? where orderId=? and productId=?;`;
        const params = [this.order.id, this.productId, this.quantity];
        
        return {q, params};
    }

    getDeleteQuery() {
        const q = `delete from order_product where orderId=? and productId=?`;
        const params = [this.order.id, this.productId];

        return {q, params};
    }
}
