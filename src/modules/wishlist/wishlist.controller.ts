import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/AuthenticdUser.interface";
import Wishlist from "./wishlist.model";
import ApiResponse from "../../utils/ApiResponse";
import { Messages } from "../../common/responseMessages";
import ApiErrorr from "../../utils/ApiError";
import Service from "./wishlist.service";
import { StatusCodes } from "http-status-codes";
import Product from "../product/product.model";

class WishlistController {
  async getUserWishlist(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const wishlist = await Service.getUserWishlist(
      (request as AuthenticatedRequest).user._id
    );
    if (!wishlist || (wishlist && !wishlist.items.length)) {
      ApiResponse(response, Messages.Wishlist.GE_ALL_FAILED, {
        results: 0,
        data: [],
      });
      return;
    }
    ApiResponse(response, Messages.Wishlist.GET_ALL_SUCCESS, {
      results: wishlist.items.length,
      data: wishlist,
    });
  }
  async addItemToWishlist(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const user: any = (request as AuthenticatedRequest).user;
    const userWishlist = await Service.getUserWishlist(user._id);
    const product = await Product.findById(request.params.id);
    if (!product) {
      return next(
        new ApiErrorr(Messages.Product.GE_ONE_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    const buildWishlist = Service.addItemToWishlist({
      userId: user._id,
      payload: product._id,
      userWishlist,
    });
    buildWishlist.populate([
      { path: "customer", select: "name email phone" },
      { path: "items", select: "title price images quantity" },
    ]);
    const wishlist = await buildWishlist;
    ApiResponse(response, Messages.Wishlist.ADD_ITEM_SUCCESS, {
      results: wishlist.items.length,
      data: wishlist,
    });
  }
  async removeItemFromWishlit(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const wishList = await Service.removeItemFromWishlist({
      userId: (request as AuthenticatedRequest).user._id,
      productId: request.params.id,
    });
    if (!wishList) {
      return next(
        new ApiErrorr(
          Messages.Wishlist.REMOVE_ITEM_FAILED,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    ApiResponse(response, Messages.Wishlist.REMOVE_ITEM_SUCCESS, {
      results: wishList.items.length,
      data: wishList,
    });
  }
  async clearUserWishlit(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const clearedWishlist = await Wishlist.findOneAndDelete({
      customer: (request as AuthenticatedRequest).user._id,
    });
    if (!clearedWishlist) {
      return next(
        new ApiErrorr(
          Messages.Wishlist.CEAR_ITEMS_FAILED,
          StatusCodes.BAD_REQUEST
        )
      );
    }
    ApiResponse(response, Messages.Wishlist.CEAR_ITEMS_SUCCESS);
  }
}
export default new WishlistController();
