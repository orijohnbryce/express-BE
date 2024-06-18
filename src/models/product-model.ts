import Joi from "joi";
import { ValidationError } from "./exceptions";

// import { ValidationError } from "./exceptions";

class ProductModel {
  id: number;
  name: string;
  price: number;

  constructor(pm: ProductModel) {
    this.name = pm.name;
    this.price = pm.price;
    this.id = pm.id;
  }

  private static validateSchema = Joi.object({
    name: Joi.string().required().min(2).max(20),
    price: Joi.number().required().positive(),
    id: Joi.number().optional().positive(),
  });

  validate(): void {
    const res = ProductModel.validateSchema.validate(this);    
    if (res.error) throw new ValidationError(res.error.details[0].message);
  }

  getInsertQuery() {
    const q = `insert into product (name, price) 
                values (?, ?);`;
    const params = [this.name, this.price];

    return { q, params };
  }

  getUpdateQuery() {
    const q = `update product set name=?, price=? where id=?;`;
    const params = [this.name, this.price, this.id];

    return { q, params };
  }

  getDeleteQuery() {
    const q = `delete from product where id=?;`;
    const params = [this.id];

    return { q, params };
  }
}

export default ProductModel;
