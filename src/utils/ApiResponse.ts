import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Document } from "mongodb";
import { UserI } from "../interfaces/user.interface";
type Data = {
  results?: number;
  data?: Document | Document[];
  metadata?: {
    hasPrev: boolean;
    hasNext: boolean;
    limit: number;
    currentPage: number;
    numberOfPages: number;
  };
  numOfCartItems?: number;
  cartId?: string;
  user?: UserI;
  token?: string;
};

const ApiResponse = (response: Response, message: string, data?: Data) =>
  response.status(StatusCodes.OK).json({
    status: true,
    message,
    ...data,
  });

export default ApiResponse;
