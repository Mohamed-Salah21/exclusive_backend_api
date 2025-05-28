import { validatorMdlwr } from "../../middlewars/validatorMdlwr";
import { body } from "express-validator";
class CartValidations {
  addCartItem = [
    body("productId")
      .notEmpty()
      .withMessage(`Product Id is required`)
      .isMongoId()
      .withMessage(`Product id must be valid`),
    body("count")
      .optional({ nullable: true })
      .isInt({ min: 1 })
      .withMessage("Count must be greater then 0"),
    validatorMdlwr,
  ];
}
export default new CartValidations();
