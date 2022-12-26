import express from "express";
import { ROLES } from "../../Constants.js";
import userController from "../Controllers/userController.js";
import { isAuthenticated } from "../middleWares/authentication.js";
import { CAPABILITY } from "../middleWares/authorization.js";

const userRouter = express.Router();

export default userRouter;
