import moment from "moment/moment.js";
import {
  ADD_TIME_FORMAT,
  ATTENDANCE_STATUS,
  RESPONSE_STATUS,
  ROLES,
  STATUS,
  VIEW_TIME_FORMAT,
} from "../../Constants.js";
import { handleError } from "../../Utilities/ResponseHandler.js";
import { Attendance, User } from "../Database/Models/index.js";
import { DataTypes, Op } from "sequelize";
import sequelize from "../Database/Database.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
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
  const { month, year } = req.query;
  const { _month, _year } = sanitizeObject({ month, year });

  const { tenant } = req;

  User.findAll({
    attributes: ["id", "name", "tenantId", "username"],
    include: {
      model: Attendance,
      as: "attendance",
      where: {
        [Op.all]: sequelize.literal(
          `month(markedon) = '${_month}' AND year(markedon) = '${_year}'`
        ),
      },
      required: false,
      right: false,
    },
    where: {
      tenantId: tenant,
      roleId: ROLES.USER.ID,
    },
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

attendanceController.approveAttendance = (req, res) => {
  const { tenant = "", username = "" } = req;
  const { user: { id, tenantId } = { id: null, tenantId: null }, data = [] } =
    req.body;
  const { _id, _tenantId } = sanitizeObject({ id, tenantId });
  const updationTime = moment().format(ADD_TIME_FORMAT);
  if (tenant === _tenantId) {
    sequelize
      .query(
        `UPDATE attendances SET approvedBy="${username}",ApprovedOn="${updationTime}",status=${true} WHERE UserId = ${_id} AND ID IN (${data.join(
          `,`
        )}) AND status=false`
      )
      .then((response) => {
        const [_, metadata = {}] = response;
        if (metadata.affectedRows > 0) {
          res.status(RESPONSE_STATUS.OK_200).send({
            status: STATUS.SUCCESS,
            approver: username,
            updationTime,
            message:
              (data ?? "").length === metadata.affectedRows
                ? `All Attendance approved successfully.`
                : `Attendance partially Updated.`,
          });
        } else {
          res.status(RESPONSE_STATUS.OK_200).send({
            status: STATUS.FAILURE,
            message: `Unable to approve attendance.`,
          });
        }
      })
      .catch((e) => handleError(e, res));
  } else {
    res.status(RESPONSE_STATUS.FORBIDDEN_403).send({
      status: STATUS.FAILURE,
      message: "Unauthorized to Approve Attendance.",
    });
  }
};

attendanceController.regularizeAttendance = (req, res) => {
  res.send([]);
};

export default attendanceController;
