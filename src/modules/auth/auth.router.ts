import { Router } from "express";
import ctr from "./auth.controller";
import vld from "./auth.validations";
const authRouter = Router();

authRouter.route("/signup").post(vld.signup, ctr.signup);
authRouter.route("/signin").post(vld.signin, ctr.signin);

export default authRouter;
