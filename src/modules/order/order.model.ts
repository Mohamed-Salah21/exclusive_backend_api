import mongoose from "mongoose";
import { Models } from "../../common/dbModels";
import { OrderI } from "../../interfaces/order.interface";

const orderSchema = new mongoose.Schema<OrderI & Document>(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: Models.PRODUCT,
        },
        count: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalCartPrice: Number,
    customer: {
      type: mongoose.Types.ObjectId,
      ref: Models.USER,
      require: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      require: true,
    },
    isDelivered: Boolean,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(Models.ORDER, orderSchema);
export default Order;
