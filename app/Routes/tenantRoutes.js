import express from "express";
import { ROLES } from "../../Constants.js";
import tenantController from "../Controllers/tenantController.js";
import { isAuthenticated } from "../middleWares/authentication.js";
import { CAPABILITY } from "../middleWares/authorization.js";

const authRouter = express.Router();
authRouter.use(isAuthenticated);

authRouter
  .route("/")
  .post(CAPABILITY([ROLES.SUPER_ADMIN.VALUE]), tenantController.createTenant)
  .put(CAPABILITY([ROLES.SUPER_ADMIN.VALUE]), tenantController.updateTenant);

authRouter.route("/:id").delete(tenantController.deleteTenant);

authRouter
  .route("/")
  .get(
    CAPABILITY([ROLES.SUPER_ADMIN.VALUE, ROLES.ADMIN.VALUE]),
    tenantController.getTenant
  );
export default authRouter;
