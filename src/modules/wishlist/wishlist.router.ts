import { Router } from "express";
import ctr from "./wishlist.controller";
import checkAuthMdlwr from "../../middlewars/checkAuth.middleware";
const wishlistRouter = Router();

wishlistRouter.use(checkAuthMdlwr);

wishlistRouter
  .route("/")
  .get(ctr.getUserWishlist)
  .delete(ctr.clearUserWishlit);
wishlistRouter.route("/:id").post(ctr.addItemToWishlist).delete(ctr.removeItemFromWishlit);
export default wishlistRouter;
