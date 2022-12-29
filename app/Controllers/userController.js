import { Role, Tenants, User } from "../Database/Models/index.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
import {
  RESPONSE_STATUS,
  ROLES,
  SEQUELIZE_UNIQUE_CONSTRAINT,
  STATUS,
} from "../../Constants.js";
import { config } from "dotenv";
import moment from "moment";
const userController = {};
config();

userController.getAllUser = async (req, res) => {
  const { role, tenant } = req;
  if (role === ROLES.ADMIN.VALUE && (tenant === undefined || tenant === null)) {
    res.status(RESPONSE_STATUS.OK_200).send({
      message: `Tenant/Shop not assigned. Please contact administrator!`,
      status: STATUS.FAILURE,
    });
  } else {
    await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: [
        { model: Tenants, as: "tenant", attributes: ["id", "name", "branch"] },
        { model: Role, as: "role" },
      ],
      where:
        role === ROLES.ADMIN.VALUE
          ? {
              roleId: ROLES.USER.ID,
              tenantId: tenant,
            }
          : {},
    })
      .then((data) => {
        res.status(RESPONSE_STATUS.OK_200).send({
          status: STATUS.SUCCESS,
          data,
          message: "User List Fetched.",
        });
      })
      .catch((e) => {
        console.trace(e);
        res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
          status: STATUS.FAILURE,
          message: "Issue while fetching user list.",
        });
      });
  }
};

userController.addUser = async (req, res) => {
  const { role, tenant } = req;
  const { name, username, mobile, isActive, tenantId } = req.body;
  const { _name, _username, _mobile } = sanitizeObject({
    name,
    username,
    mobile,
  });
  const token = Math.random().toString().substring(2, 8);
  const validTill = moment().add(10, "minute").format("YYYY-MM-DD HH:mm:ss");
  const roleId =
    role === ROLES.SUPER_ADMIN.VALUE ? ROLES.ADMIN.ID : ROLES.USER.ID;

  await User.create({
    name: _name,
    username: _username?.toLowerCase(),
    mobile: _mobile,
    isActive,
    tenantId: role === ROLES.SUPER_ADMIN.VALUE ? tenantId : tenant,
    token,
    validTill,
    roleId,
    createdBy: req.username,
  })
    .then((data) => {
      res
        .status(RESPONSE_STATUS.CREATED_201)
        .send({ status: STATUS.SUCCESS, data, message: "User Created." });
    })
    .catch((e) => {
      if (e.name === SEQUELIZE_UNIQUE_CONSTRAINT) {
        res.status(RESPONSE_STATUS.OK_200).send({
          message: "User already exists.",
          issue: e.errors.map(({ message }) => message),
          status: STATUS.DUPLICATE,
        });
      } else {
        console.trace(e);
        res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
          message: `Issue while creating User`,
          status: STATUS.FAILURE,
        });
      }
    });
};
export default userController;
