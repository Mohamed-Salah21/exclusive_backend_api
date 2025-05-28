import { Models } from "../../common/dbModels";
import { getAll, getById } from "../factory/factory.controller";
import Product from "./product.model";

class ProductController {
  getAllProducts = getAll(Product, Models.PRODUCT);
  getProductById = getById(Product, Models.PRODUCT);
}

export default new ProductController();
