import { Document, Schema, model, Types } from "mongoose";
import { CategoryI } from "../../interfaces/category.interface";
import { Models } from "../../common/dbModels";
import { WishlistI } from "../../interfaces/wishlist.interface";

const wishlistSchema = new Schema<WishlistI & Document>(
  {
    customer: {
      type: Types.ObjectId,
      ref: Models.USER,
      require: true,
    },
    items: [
      {
        type: Types.ObjectId,
        ref: Models.PRODUCT,
        require: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Wishlist = model(Models.WISHLIST, wishlistSchema);
export default Wishlist;
