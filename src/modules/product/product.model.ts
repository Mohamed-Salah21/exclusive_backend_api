import mongoose, { Schema, model, Document } from "mongoose";
import { Models } from "../../common/dbModels";
import { ProductI } from "../../interfaces/product.interface";

const productSchema = new Schema<ProductI & Document>({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  slug: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 1,
  },
  images: [String],
  ratingsAverage: {
    type: Number,
    default: 1,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: Models.CATEGORY,
  },
  subCategory: {
    type: mongoose.Types.ObjectId,
    ref: Models.CATEGORY,
  },
});

const Product = model(Models.PRODUCT, productSchema);
export default Product;
