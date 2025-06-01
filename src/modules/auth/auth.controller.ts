import { NextFunction, Request, Response } from "express";
import User from "../user/user.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { Messages } from "../../common/responseMessages";
import { StatusCodes } from "http-status-codes";
import wishlistService from "../wishlist/wishlist.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Wishlist from "../wishlist/wishlist.model";
import userService from "../user/user.service";
class AuthController {
  async signup(request: Request, response: Response, next: NextFunction) {
    const user: any = await User.findOne({
      email: request.body.email,
    });
    if (user) {
      return next(
        new ApiError(Messages.Auth.SIGNUP_FAILED, StatusCodes.NOT_FOUND)
      );
    }

    const hashedPassword = await bcrypt.hash(
      request.body.password,
      Number(process.env.HASH_SALT)
    );
    delete request.body.rePassword;
    const document = await User.create({
      ...request.body,
      password: hashedPassword,
    });
    let configMsg = Messages.Auth.SIGNUP_SUCCESS.split(",");
    const msg = configMsg[0] + " " + request.body.name + configMsg[1];

    document.save();
    const token = jwt.sign(
      { userId: document._id },
      `${process.env.JWT_SECRET_CODE}`,
      {
        expiresIn: process.env.JWT_EXPIRE_TOKEN as any,
      }
    );
    const { password, createdAt, updatedAt, __v, ...safeUser } =
      document.toObject();
    ApiResponse(response, msg, {
      token,
      user: safeUser,
    });
  }
  async signin(request: Request, response: Response, next: NextFunction) {
    const user: any = await User.findOne({
      email: request.body.email,
    });
    const isMatchPass = await bcrypt.compare(
      request.body.password,
      user?.password || ""
    );
    if (!user || !isMatchPass) {
      return next(
        new ApiError(Messages.Auth.SIGNIN_FAILED, StatusCodes.NOT_FOUND)
      );
    }
    const token = jwt.sign(
      { userId: user._id },
      `${process.env.JWT_SECRET_CODE}`,
      {
        expiresIn: process.env.JWT_EXPIRE_TOKEN as any,
      }
    );

    let configMsg = Messages.Auth.SIGNIN_SUCCESS.split(",");
    const msg = configMsg[0] + " " + user.name + configMsg[1];
    const { __v, password, createdAt, updatedAt, ...safeUser } =
      user.toObject();
    const userWishlistItemsIds = await userService.getMyWishlistIds(user._id);
    const cartItemsCount: any = await userService.getMyCartItemsCount(user._id);
    ApiResponse(response, msg, {
      token,
      user: safeUser,
      cartItemsCount,
      userWishlistItemsIds,
    });
  }
}
export default new AuthController();
