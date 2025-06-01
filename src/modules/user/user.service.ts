import { Model, Types } from "mongoose";
import User from "./user.model";
import wishlistService from "../wishlist/wishlist.service";
import cartService from "../cart/cart.service";

class UserService<UserI> {
  private model: Model<UserI>;
  constructor(model: Model<UserI>) {
    this.model = model;
  }
  async getMyCartItemsCount(userId: string) {
    return await cartService.getUserCartItemsCount(userId);
  }
}
export default new UserService(User);
