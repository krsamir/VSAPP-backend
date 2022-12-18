import express from "express";
import tenantController from "../Controllers/tenantController.js";
import { isAuthenticated } from "../middleWares/authentication.js";
import { IS_SUPER_ADMIN } from "../middleWares/authorization.js";

const authRouter = express.Router();
authRouter.use(isAuthenticated);
authRouter.use(IS_SUPER_ADMIN);
authRouter
  .route("/")
  .get(tenantController.getTenant)
  .post(tenantController.createTenant)
  .put(tenantController.updateTenant);
export default authRouter;
