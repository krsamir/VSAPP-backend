import bcryptjs from "bcryptjs";
import moment from "moment";
import { Role, User, Tenants } from "../Database/Models/index.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
import { RESPONSE_STATUS, STATUS, ROLES } from "../../Constants.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
const authController = {};
config();
const { JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;
authController.login = async (req, res) => {
  var { username, password } = req.body;
  const { _username, _password } = sanitizeObject({ username, password });
  console.log(sanitizeObject({ username, password }));
  await User.findOne({
    attributes: ["id", "username", ["password", "hashedpassword"], "isActive"],
    where: {
      username: _username,
    },
    include: [
      { model: Role, as: "role" },
      { model: Tenants, as: "tenant" },
    ],
  })
    .then((user) => {
      if (user) {
        const { hashedpassword, username, id, role, tenant } = user.toJSON();
        if (user.isActive) {
          const isMatched = bcryptjs.compareSync(
            _password,
            hashedpassword ?? ""
          );
          if (isMatched) {
            let assignedRole = "";
            if (role) {
              switch (role.role) {
                case ROLES.SUPER_ADMIN.NAME:
                  assignedRole = ROLES.SUPER_ADMIN.VALUE;
                  break;
                case ROLES.ADMIN.NAME:
                  assignedRole = ROLES.ADMIN.VALUE;
                  break;
                case ROLES.USER.NAME:
                  assignedRole = ROLES.USER.VALUE;
                  break;
                default:
                  assignedRole = null;
                  break;
              }
            }
            const jwtToken = jwt.sign(
              {
                id: id,
                email: username,
                role: assignedRole,
              },
              JWT_SECRET,
              {
                expiresIn: JWT_EXPIRATION_TIME,
              }
            );
            res.cookie("sid", jwtToken, { path: "/" });
            if (assignedRole) {
              res.cookie("role", assignedRole, { path: "/" });
            }
            res.send({
              message: "Succesfull login.",
              status: STATUS.SUCCESS,
              role: assignedRole,
            });
          } else {
            removeCookies(res);
            res
              .status(RESPONSE_STATUS.FORBIDDEN_403)
              .send({ message: "Invalid Credentials", status: STATUS.FAILURE });
          }
        } else {
          removeCookies(res);
          res.status(RESPONSE_STATUS.OK_200).send({
            message: "You are temprorarily inactive. Please contact admin.",
            status: STATUS.FAILURE,
          });
        }
      } else {
        removeCookies(res);
        res
          .status(RESPONSE_STATUS.FORBIDDEN_403)
          .send({ message: "Invalid Credentials", status: STATUS.FAILURE });
      }
    })
    .catch((e) => {
      removeCookies(res);
      console.log(e);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send(e);
    });
};

export const removeCookies = (res) => {
  res.clearCookie("sid", { path: "/" });
  res.clearCookie("role", { path: "/" });
};
export default authController;
