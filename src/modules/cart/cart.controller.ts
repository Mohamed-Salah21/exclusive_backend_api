import { NextFunction, Request, Response } from "express";
import Cart from "./cart.model";
import { AuthenticatedRequest } from "../../interfaces/AuthenticdUser.interface";
import ApiErrorr from "../../utils/ApiError";
import Service from "./cart.service";
import { Messages } from "../../common/responseMessages";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../../utils/ApiResponse";
import Product from "../product/product.model";

class CartController {
  async getUserCart(request: Request, response: Response, next: NextFunction) {
    const userCart = await Cart.findOne({
      cartOwner: (request as AuthenticatedRequest).user._id,
    }).populate({
      path: "products.product",
      select: "title price images quantity",
    });
    if (!userCart || (userCart && !userCart.products.length)) {
      ApiResponse(response, Messages.Cart.GE_ALL_FAILED, {
        numOfCartItems: 0,
        data: {
          products: [],
          totalCartPrice: 0,
        },
      });
      return;
    }
    ApiResponse(response, Messages.Cart.GET_ALL_SUCCESS, {
      results: userCart.products.length,
      data: userCart,
    });
  }

  async addToCart(request: Request, response: Response, next: NextFunction) {
    const user: any = (request as AuthenticatedRequest).user;
    const userCart = await Service.findUserCart(user._id);
    const product = await Product.findById(request.body.productId);
    if (!product) {
      return next(
        new ApiErrorr(Messages.Product.GE_ONE_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    const buildCart = Service.addCart({
      userId: user._id,
      userCart,
      cartItem: {
        product: product._id,
        price: product?.price || 10,
        count: +request.body.count || 1,
      },
    });
    const cart = await buildCart;
    const totalPrice = await (Cart as any).calcTotalPrice(cart);
    ApiResponse(response, Messages.Cart.ADD_ITEM_SUCCESS, {
      numOfCartItems: cart.products.length,
      cartId: cart._id,
      data: {
        cartId: cart._id,
        totalCartPrice: totalPrice,
        products: cart.products,
      },
    });
  }
  async updateCartQty(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userCart = await Cart.findOne({
      cartOwner: (request as AuthenticatedRequest).user._id,
    }).populate({
      path: "products.product",
      select: "title price images quantity",
    });
    if (!userCart) {
      return next(
        new ApiErrorr(Messages.Cart.GE_ALL_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    const itemIndex = userCart.products.findIndex(
      (item: any) =>
        JSON.stringify(item.product._id) === JSON.stringify(request.params.id)
    );
    if (itemIndex < 0) {
      return next(
        new ApiErrorr(Messages.Cart.UPDATE_QTY_FAILED, StatusCodes.NOT_FOUND)
      );
    } else {
      userCart.products[itemIndex].count = +request.body.count || 1;
      const totalPrice = await (Cart as any).calcTotalPrice(userCart);
      userCart.totalCartPrice = totalPrice;
      userCart.save();
      ApiResponse(response, Messages.Cart.UPDATE_QTY_SUCCESS, {
        data: userCart,
      });
    }
  }
  async removeCartItem(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const userCart = await Service.removeCartItem({
      userId: (request as AuthenticatedRequest).user._id,
      productId: request.params.id,
    });
    if (!userCart) {
      return next(
        new ApiErrorr(Messages.Cart.REMOVE_ITEM_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    ApiResponse(response, Messages.Cart.REMOVE_ITEM_SUCCESS, {
      data: userCart,
    });
  }
  async clearUserCart(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const clearedCart = await Cart.findOneAndDelete({
      cartOwner: (request as AuthenticatedRequest).user._id,
    });
    if (!clearedCart) {
      return next(
        new ApiErrorr(Messages.Cart.CEAR_ITEMS_FAILED, StatusCodes.BAD_REQUEST)
      );
    }
    ApiResponse(response, Messages.Cart.CEAR_ITEMS_SUCCESS);
  }
}
export default new CartController();
