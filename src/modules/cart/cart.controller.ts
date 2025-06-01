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
      select: "title price images quantity imageCover",
    });
    if (!userCart || (userCart && !userCart.products.length)) {
      let dataRes: any = {
        totalCartPrice: 0,
        products: [],
      };
      if (userCart && userCart._id) {
        dataRes.cartId = userCart._id;
      }
      ApiResponse(response, Messages.Cart.GET_ALL_SUCCESS, {
        numOfCartItems: 0,
        data: dataRes,
      });
      return;
    }
    const totalPrice = await (Cart as any).calcTotalPrice(userCart);
    ApiResponse(response, Messages.Cart.GET_ALL_SUCCESS, {
      numOfCartItems: userCart.products.length,
      data: {
        cartId: userCart._id,
        totalCartPrice: totalPrice,
        products: userCart.products,
      },
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
        imageCover: product?.imageCover || "default.png",
      },
    });
    const cart = await buildCart;
    const totalPrice = await (Cart as any).calcTotalPrice(cart);
    ApiResponse(response, Messages.Cart.ADD_ITEM_SUCCESS, {
      numOfCartItems: cart.products.length,
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
      select: "title price images quantity imageCover",
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
        numOfCartItems: userCart.products.length,
        data: {
          cartId: userCart._id,
          totalCartPrice: userCart.totalCartPrice,
          products: userCart.products,
        },
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
      numOfCartItems: userCart.products.length,
      data: {
        cartId: userCart._id,
        totalCartPrice: userCart.totalCartPrice,
        products: userCart.products,
      },
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
    ApiResponse(response, Messages.Cart.CEAR_ITEMS_SUCCESS, {
      numOfCartItems: 0,
      data: {
        cartId: clearedCart._id,
        totalCartPrice: 0,
        products: [],
      },
    });
  }
}
export default new CartController();
