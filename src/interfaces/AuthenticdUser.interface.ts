import { Request } from "express";
import { UserI } from "./user.interface";

export interface AuthenticatedRequest extends Request {
  user: UserI;
}
