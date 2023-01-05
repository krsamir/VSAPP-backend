import authController from "../Controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/change", authController.changePassword);
authRouter.post("/reset", authController.resetToken);
export default authRouter;
