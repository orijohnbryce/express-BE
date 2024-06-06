import Joi from "joi";
import { ValidationError } from "./exceptions";


class ProductModel {
    name: string
    price: number

    private static validateSchema = Joi.object({
        name: Joi.string().required().min(2).max(20),
        price: Joi.number().required().positive(),
    })

    constructor(pm: ProductModel) {
        this.name = pm.name;
        this.price = pm.price;
    }

    validate(): void {        
        const res = ProductModel.validateSchema.validate(this);        
        
        // if (res.error?.message) throw new ValidationError(res.error.message)
        if (res.error?.details?.length > 0)            
            throw new ValidationError(res.error.details[0].message)
    }
}

export default ProductModel;