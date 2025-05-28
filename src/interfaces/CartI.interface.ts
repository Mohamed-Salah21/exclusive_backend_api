import mongoose from "mongoose";

export interface CartI {
  cartOwner: string;
  totalNumber: number;
  totalCartPrice: number;
  products: mongoose.Types.ObjectId[];
}
