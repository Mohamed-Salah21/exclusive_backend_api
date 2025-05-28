import { Models } from "../../common/dbModels";
import { getAll, getById } from "../factory/factory.controller";
import Category from "./category.model";

class CategpryController {
  getAllCategories = getAll(Category, Models.CATEGORY);
  getCategoryById = getById(Category, Models.CATEGORY);
}
export default new CategpryController();
