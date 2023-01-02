import express from "express";
import { ROLES } from "../../Constants.js";
import userController from "../Controllers/userController.js";
import { isAuthenticated } from "../middleWares/authentication.js";
import { CAPABILITY } from "../middleWares/authorization.js";
import { CHECK_TENANT } from "../middleWares/CheckApiAuthority.js";

const userRouter = express.Router();
userRouter.use(isAuthenticated);
userRouter.use(CHECK_TENANT);

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
userRouter
  .route("/:id")
  .delete(
    CAPABILITY([ROLES.SUPER_ADMIN.VALUE, ROLES.ADMIN.VALUE]),
    userController.deleteUser
  );
export default userRouter;
