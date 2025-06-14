import { Model, Types } from "mongoose";
import Cart from "./cart.model";
import { Models } from "../../common/dbModels";
class CartService<CartI> {
  private model;
  constructor(model: Model<CartI>) {
    this.model = model;
  }
  async findUserCart(userId: string) {
    return await this.model
      .findOne({
        cartOwner: userId,
      })
      .populate({
        path: "products.product",
        select: "title price images quantity imageCover",
      });
  }
  async getLoggedUserCart(userId: string) {
    const userCart = await this.model.findOne({ cartOwner: userId });
  }
  async addCart(params: any = {}) {
    const { userId, cartItem, userCart } = params;
    let cart = userCart;
    if (!cart) {
      cart = await this.model.create({
        cartOwner: userId,
        products: [cartItem],
      });
      cart = await cart.populate([
        { path: "cartOwner", select: "name email phone" },
        {
          path: "products.product",
          select: "title price images quantity imageCover",
        },
      ]);
    } else {
      const cItemIndex = cart.products.findIndex(
        (cItem: any) =>
          JSON.stringify(cItem.product._id) == JSON.stringify(cartItem.product)
      );

      if (cItemIndex < 0) {
        cart = await Cart.findOneAndUpdate(
          { cartOwner: userId },
          {
            $addToSet: {
              products: {
                product: cartItem.product,
                count: cartItem.count,
                price: cartItem.price,
                imageCover: cartItem.imageCover,
              },
            },
          },
          { new: true }
        ).populate([
          { path: "cartOwner", select: "name email phone" },
          {
            path: "products.product",
            select: "title price images quantity imageCover",
          },
        ]);
      } else {
        cart.products[cItemIndex].count += cartItem.count;
        cart.save();
      }
    }
    return cart;
  }
  async removeCartItem(params: any = {}) {
    const item = await this.model.findOne({
      cartOwner: params.userId,
      "products.product": params.productId,
    });
    if (!item) return null;
    const cart = await this.model
      .findOneAndUpdate(
        { cartOwner: params.userId },
        { $pull: { products: { product: params.productId } } },
        { new: true }
      )
      .populate([
        { path: "cartOwner", select: "name email phone" },
        {
          path: "products.product",
          select: "title price images quantity imageCover",
        },
      ]);
    const totalPrice = await (Cart as any).calcTotalPrice(cart);
    (cart as any).totalCartPrice = totalPrice;
    await cart?.save();
    return cart;
  }
  async getUserCartItemsCount(userId: string) {
    const cart: any = await this.model
      .findOne({
        cartOwner: userId,
      })
      .populate("products.product");
    const cartItems = cart?.products || [];
    if (!cartItems[0]) return 0;
    return cart.products.reduce((acc: any, item: any) => acc + item.count, 0);
  }
}
export default new CartService(Cart);
