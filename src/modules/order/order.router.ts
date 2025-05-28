import { Router } from "express";
import ctr from "./order.controller";
import checkAuthMdlwr from "../../middlewars/checkAuth.middleware";
const orderRouter = Router();
orderRouter.use(checkAuthMdlwr);
orderRouter.route("/").get(ctr.getUserOrders);
orderRouter.route("/").post(ctr.createOrder);
export default orderRouter;
