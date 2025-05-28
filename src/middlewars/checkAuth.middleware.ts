import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import User from "../modules/user/user.model";
import { AuthenticatedRequest } from "../interfaces/AuthenticdUser.interface";
import { Messages } from "../common/responseMessages";
const checkAuthMdlwr = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token: any = request.headers["token"];
    if (!token) {
      return next(
        new ApiError(Messages.Auth.MISSED_TOKEN, StatusCodes.UNAUTHORIZED)
      );
    }

    const decode: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET_CODE as jwt.Secret
    );
    const user = await User.findById(decode.userId);
    if (!user) {
      return next(new ApiError(Messages.User.GE_ONE_FAILED, 403));
    }

    (request as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    next(
      new ApiError(
        `${Messages.Auth.FAILED}: ${error}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export default checkAuthMdlwr;
