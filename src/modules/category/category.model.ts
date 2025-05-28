import { Document, Schema, model } from "mongoose";
import { CategoryI } from "../../interfaces/category.interface";
import { Models } from "../../common/dbModels";

const categorySchema = new Schema<CategoryI & Document>(
  {
    name: {
      type: String,
      require: true,
    },
    image : String,
    slug: String,
  },
  {
    timestamps: true,
  }
);
const Category = model(Models.CATEGORY, categorySchema);
export default Category;
