import { Schema, model, Types } from "mongoose";
import { Models } from "../../common/dbModels";
import { CartI } from "../../interfaces/CartI.interface";

const cartSchema = new Schema(
  {
    cartOwner: {
      type: Types.ObjectId,
      ref: Models.USER,
    },
    totalCartPrice: { type: Number, default: 1 },
    products: [
      {
        count: { type: Number, default: 1 },
        price: { type: Number, default: 1 },
        product: {
          type: Types.ObjectId,
          ref: Models.PRODUCT,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
cartSchema.statics.calcTotalPrice = async function (cart: CartI) {
  const totalPrice = cart.products.reduce(
    (acc: number, item: any) => acc + item?.price * item.count,
    0
  );
  return totalPrice;
};
const Cart = model(Models.CART, cartSchema);
export default Cart;
