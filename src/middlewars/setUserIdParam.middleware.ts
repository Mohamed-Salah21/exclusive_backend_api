import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/AuthenticdUser.interface";
const setUserIdParamMdlwr = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  request.params.id = (request as AuthenticatedRequest).user._id;
  next();
};
export default setUserIdParamMdlwr;
