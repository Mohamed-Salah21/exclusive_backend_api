import { validatorMdlwr } from "../../middlewars/validatorMdlwr";
import { body } from "express-validator";
import User from "./user.model";
class UserValidation {
  changingPass = [
    body("currentPassword")
      .notEmpty()
      .withMessage(`Current password is required`),
    body("password").notEmpty().withMessage(`Password is required`),
    body("rePassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords are not similar");
      }
      return true;
    }),
    validatorMdlwr,
  ];
  updateUserData = [
    body().custom((value, { req }) => {
      const allowed = ["name", "phone", "email"];
      const extra = Object.keys(req.body).filter(
        (key) => !allowed.includes(key)
      );
      if (extra.length > 0) {
        throw new Error(`Unexpected fields: ${extra.join(", ")}`);
      }
      return true;
    }),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be greater then or equal 3"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid")
      .custom(async (value, { req }) => {
        const findUser = await User.findOne({
          $and: [{ email: { $ne: req.user.email } }, { email: value }],
        });
        if (findUser) throw new Error("This email is already in use");
        return true;
      }),
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isLength({ min: 3 })
      .withMessage("Phone must be greater then or equal 3"),
    validatorMdlwr,
  ];
}
export default new UserValidation();
