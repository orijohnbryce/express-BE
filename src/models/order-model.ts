import ProductModel from "./product-model";

class OrderModel {
    id?: number;
    userId: number;
    products: ProductModel[] | object[];
    date: Date;
    comments: string;

    constructor(userId: number, products: ProductModel[] | object[], date: Date = new Date(),
        comments: string = "", id?: number)
    {
        this.id = id;
        this.userId = userId;
        this.products = products;
        this.date = date;
        this.comments = comments;        
    }

    getInsertQuery() {
        const q = `insert into "order" (userId, date, comments) 
                values (?, ?, ?);`;
        const params = [this.userId, this.date, this.comments];
        
        return {q, params};
    }

    getUpdateQuery() {
        const q = `update "order" set userId=?, date=?, comments=? where id=?;`;
        const params = [this.userId, this.date.toISOString(), this.comments]                
        
        return {q, params};
    }
    getDeleteQuery() {
        const q = `delete from "order" where id=?`;
        const params = [this.id]

        return {q, params};
    }
}

export default OrderModel;