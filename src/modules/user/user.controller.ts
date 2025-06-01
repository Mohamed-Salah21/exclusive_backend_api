import { NextFunction, Request, Response } from "express";
import { Models } from "../../common/dbModels";
import { getById, updateById } from "../factory/factory.controller";
import User from "./user.model";
import { AuthenticatedRequest } from "../../interfaces/AuthenticdUser.interface";
import bcrypt from "bcryptjs";
import ApiResponse from "../../utils/ApiResponse";
import { Messages } from "../../common/responseMessages";
import ApiError from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";

class UserController {
  getUserProfile = getById(User, Models.USER);
  updateUserData = updateById(User, Models.USER);
  async changeUserPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const user: any = await User.findById(
      (request as AuthenticatedRequest).user._id
    );
    const isMatchPass = await bcrypt.compare(
      request.body.currentPassword,
      user.password
    );
    if (!isMatchPass) {
      return next(
        new ApiError(
          Messages.User.CHANGE_PASSWORD_FAILED,
          StatusCodes.NOT_FOUND
        )
      );
    }
    const hashedPassword = await bcrypt.hash(
      request.body.password,
      Number(process.env.HASH_SALT)
    );
    await User.findByIdAndUpdate(
      (request as AuthenticatedRequest).user._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    ApiResponse(response, Messages.User.CHANGE_PASSWORD_SUCCESS);
  }
}
export default new UserController();
