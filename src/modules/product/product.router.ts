import { Router } from "express";
import ctr from "./product.controller";
const productRouter = Router();
productRouter.route("/").get(ctr.getAllProducts);
productRouter.route("/:id").get(ctr.getProductById);
export default productRouter;
