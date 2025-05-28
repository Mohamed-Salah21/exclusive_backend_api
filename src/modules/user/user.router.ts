import { Router } from "express";
import ctr from "./user.controller";
import vld from "./user.validation";
import checkAuthMdlwr from "../../middlewars/checkAuth.middleware";
import setUserIdParamMdlwr from "../../middlewars/setUserIdParam.middleware";

const userRouter = Router();
userRouter.use(checkAuthMdlwr);
userRouter.route("/getProfile").get(setUserIdParamMdlwr, ctr.getUserProfile);
userRouter
  .route("/updateMe")
  .put(vld.updateUserData, setUserIdParamMdlwr, ctr.updateUserData);
userRouter
  .route("/changeMyPassword")
  .put(vld.changingPass, setUserIdParamMdlwr, ctr.changeUserPassword);

export default userRouter;
