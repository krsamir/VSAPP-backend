import authController from "../Controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
export default authRouter;
