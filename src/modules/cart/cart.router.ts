import { Router } from "express";
import ctr from "./cart.controller";
import vld from "./cart.validation";
import checkAuthMdlwr from "../../middlewars/checkAuth.middleware";
const cartRouter = Router();

cartRouter.use(checkAuthMdlwr);

cartRouter
  .route("/")
  .get(ctr.getUserCart)
  .post(vld.addCartItem, ctr.addToCart)
  .delete(ctr.clearUserCart);
cartRouter.route("/:id").put(ctr.updateCartQty).delete(ctr.removeCartItem);
export default cartRouter;
