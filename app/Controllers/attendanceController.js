import moment from "moment/moment.js";
import {
  ATTENDANCE_STATUS,
  RESPONSE_STATUS,
  ROLES,
  STATUS,
  VIEW_TIME_FORMAT,
} from "../../Constants.js";
import { handleError } from "../../Utilities/ResponseHandler.js";
import { Attendance, User } from "../Database/Models/index.js";
const attendanceController = {};

attendanceController.getAttendanceByDate = async (req, res) => {
  const { date } = req.body;
  const { id } = req;
  if (date) {
    Attendance.findOne({ where: { markedOn: date ?? null, userId: id } })
      .then((data) => {
        if (data) {
          const { status, approvedBy, ApprovedOn } = data.toJSON();
          res.status(RESPONSE_STATUS.OK_200).send({
            message: "Attendance Marked Already.",
            attendance: ATTENDANCE_STATUS.DONE,
            status: STATUS.SUCCESS,
            data: {
              status: status ? "Approved" : "Pending",
              approvedBy: approvedBy || "-",
              ApprovedOn: ApprovedOn
                ? moment(ApprovedOn).format(VIEW_TIME_FORMAT)
                : "-",
            },
          });
        } else {
          res.status(RESPONSE_STATUS.OK_200).send({
            message: "Attendance Not Marked.",
            attendance: ATTENDANCE_STATUS.PENDING,
            status: STATUS.SUCCESS,
            data: null,
          });
        }
      })
      .catch((e) => handleError(e, res));
  } else {
    res.status(RESPONSE_STATUS.OK_200).send({
      message: "Some issue while getting today's attendance status.",
      status: STATUS.FAILURE,
    });
  }
};

attendanceController.markAttendance = (req, res) => {
  const { id } = req;
  Attendance.create({ UserId: id })
    .then((data) => {
      res
        .status(RESPONSE_STATUS.CREATED_201)
        .send({ message: "Attendace Marked!!", status: STATUS.SUCCESS });
    })
    .catch((e) => handleError(e, res));
};

attendanceController.getAttendanceByAdmin = (req, res) => {
  const { tenant } = req;
  User.findAll({
    attributes: ["id", "name", "tenantId", "username"],
    include: { model: Attendance, as: "attendance" },
    where: { tenantId: tenant, roleId: ROLES.USER.ID },
  })
    .then((data) => {
      res.status(RESPONSE_STATUS.OK_200).send({
        data,
        message: "Attendance Fetched!!",
        status: STATUS.SUCCESS,
      });
    })
    .catch((e) => handleError(e, res));
};

export default attendanceController;
