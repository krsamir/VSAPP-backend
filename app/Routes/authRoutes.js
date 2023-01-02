import authController from "../Controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/validity", authController.validity);
authRouter.post("/reset", authController.resetToken);
export default authRouter;
