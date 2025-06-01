import { Document, Model } from "mongoose";
import Wishlist from "./wishlist.model";

class WishlistServic<T extends Document> {
  private model;
  constructor(model: Model<T>) {
    this.model = model;
  }
  async getUserWishlist(userId: string) {
    return await this.model
      .findOne({
        customer: userId,
      })
      .populate([
        { path: "customer", select: "name email phone" },
        { path: "items", select: "title price images quantity imageCover" },
      ]);
  }
  async addItemToWishlist(params: any = {}) {
    const { userId, payload, userWishlist } = params;
    let list = userWishlist;
    if (!list) {
      list = await this.model.create({
        customer: userId,
        items: [payload],
      });
    } else {
      list = await this.model.findOneAndUpdate(
        { customer: userId },
        {
          $addToSet: { items: payload },
        },
        { new: true }
      );
    }
    await list.populate([
      { path: "customer", select: "name email phone" },
      { path: "items", select: "title price images quantity imageCover" },
    ]);
    return list;
  }
  async removeItemFromWishlist(params: any = {}) {
    const item = await this.model.findOne({
      customer: params.userId,
      items: params.productId,
    });
    if (!item) return null;
    const wishlist = await this.model
      .findOneAndUpdate(
        { customer: params.userId },
        { $pull: { items: params.productId } },
        { new: true }
      )
      .populate([
        { path: "customer", select: "name email phone" },
        { path: "items", select: "title price images quantity imageCover" },
      ]);
    await wishlist?.save();
    return wishlist;
  }
}
export default new WishlistServic(Wishlist);
