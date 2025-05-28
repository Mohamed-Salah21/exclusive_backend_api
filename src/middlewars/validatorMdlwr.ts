import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
export const validatorMdlwr = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0]?.msg;
    response.status(400).send({ error: errorMessage });
    return;
  }
  next();
};
