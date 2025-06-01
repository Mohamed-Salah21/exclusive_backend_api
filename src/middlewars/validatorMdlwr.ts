import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
export const validatorMdlwr = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(request);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((err: any) => ({ path: err.path, message: err.msg }));
    console.log("Errors validations", errors);
    response
      .status(StatusCodes.BAD_REQUEST)
      .send({ status: "Validation failed", errors });
    return;
  }
  next();
};
