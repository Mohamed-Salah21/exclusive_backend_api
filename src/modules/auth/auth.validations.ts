import { validatorMdlwr } from "../../middlewars/validatorMdlwr";
import { body } from "express-validator";
class AuthValidation {
  signup = [
    body("name")
      .notEmpty()
      .withMessage(`Name is required`)
      .isLength({ min: 3, max: 18 })
      .withMessage(`Name must have between 3 and 14 characters`),
    body("email")
      .notEmpty()
      .withMessage(`Email is required`)
      .isEmail()
      .withMessage("Email must be valied"),
    body("phone").notEmpty().withMessage(`Phone is required`),
    body("password").notEmpty().withMessage("Password is required"),
    body("rePassword")
      .notEmpty()
      .withMessage("Confirmed Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
    validatorMdlwr,
  ];
  signin = [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valied"),
    body("password").notEmpty().withMessage("Password is required"),
    validatorMdlwr,
  ];
}
export default new AuthValidation();
