import { Router } from "express";
import ctr from "./category.controller";
const categoryRouter = Router();
categoryRouter.route("/").get(ctr.getAllCategories);
categoryRouter.route("/:id").get(ctr.getCategoryById);
export default categoryRouter;
