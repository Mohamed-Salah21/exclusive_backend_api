import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

const globalErrorHandlerMdlwr = (
  error: ApiError,
  request: Request,
  ressponse: Response,
  next: NextFunction
) => {
  ressponse.status(error.statusCode || 500).send({
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    error,
  });
};
export default globalErrorHandlerMdlwr;
