import { NextFunction, request, Request, Response } from "express";
import Cart from "../cart/cart.model";
import { AuthenticatedRequest } from "../../interfaces/AuthenticdUser.interface";
import Order from "./order.model";
import ApiError from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import Product from "../product/product.model";
import ApiResponse from "../../utils/ApiResponse";
import { Messages } from "../../common/responseMessages";

class OrderController {
  async getUserOrders(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const orders = await Order.find({
      customer: (request as AuthenticatedRequest).user._id,
    }).populate([
      { path: "customer", select: "name email phone" },
      { path: "cartItems.product", select: "title price sold quantity" },
    ]);
    if (!orders) {
      return next(
        new ApiError(Messages.Order.GET_ALL_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    ApiResponse(response, Messages.Order.GET_ALL_SUCCESS, {
      data: orders,
    });
  }
  async createOrder(request: Request, response: Response, next: NextFunction) {
    const cart = await Cart.findOne({
      cartOwner: (request as AuthenticatedRequest).user._id,
    }).select("products totalCartPrice");
    if (!cart || (cart && cart.products.length < 1)) {
      return next(
        new ApiError(Messages.Order.CART_EMPTY_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    const cItemWithoutQty = cart.products.find(
      (ci: any) => ci.count > ci.product.quantity
    );
    if (cItemWithoutQty) {
      const { title, quantity } = cItemWithoutQty.product as any;
      return next(
        new ApiError(
          `You added product ${title} in cart with ${cItemWithoutQty.count} quantity, there a ${quantity} only in this product`,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    let order = await Order.create({
      customer: (request as AuthenticatedRequest).user._id,
      totalCartPrice: cart.totalCartPrice,
      cartItems: cart.products,
      isPaid: false,
      isDelivered: false,
      status: "pending",
    });

    if (order) {
      const bulkOptions = cart.products.map((item: any) => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      }));
      await Product.bulkWrite(bulkOptions, {});
      await Cart.findByIdAndDelete(cart._id);
      order.save();
    }
    ApiResponse(response, Messages.Order.CREATED_SUCCESS);
  }
}
export default new OrderController();
