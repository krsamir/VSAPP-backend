import express from "express";
import { ROLES } from "../../Constants.js";
import userController from "../Controllers/userController.js";
import { isAuthenticated } from "../middleWares/authentication.js";
import { CAPABILITY } from "../middleWares/authorization.js";

const userRouter = express.Router();
userRouter.use(isAuthenticated);

userRouter
  .route("/")
  .get(
    CAPABILITY([ROLES.SUPER_ADMIN.VALUE, ROLES.ADMIN.VALUE]),
    userController.getAllUser
  )
  .post(
    CAPABILITY([ROLES.SUPER_ADMIN.VALUE, ROLES.ADMIN.VALUE]),
    userController.addUser
  )
  .put(
    CAPABILITY([ROLES.SUPER_ADMIN.VALUE, ROLES.ADMIN.VALUE]),
    userController.updateUser
  );
userRouter.route("/:id").delete(userController.deleteUser);
export default userRouter;
