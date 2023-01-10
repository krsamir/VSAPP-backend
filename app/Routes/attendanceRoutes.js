import express from "express";
import attendanceController from "../Controllers/attendanceController.js";
import { isAuthenticated } from "../middleWares/authentication.js";
import { CAPABILITY } from "../middleWares/authorization.js";
import { ROLES } from "../../Constants.js";

const attendanceRouter = express.Router();
attendanceRouter.use(isAuthenticated);

attendanceRouter
  .route("/")
  .post(CAPABILITY([ROLES.USER.VALUE]), attendanceController.markAttendance);
attendanceRouter
  .route("/date")
  .post(
    CAPABILITY([ROLES.USER.VALUE]),
    attendanceController.getAttendanceByDate
  );
attendanceRouter
  .route("/users")
  .post(
    CAPABILITY([ROLES.ADMIN.VALUE]),
    attendanceController.getAttendanceByAdmin
  );

export default attendanceRouter;
