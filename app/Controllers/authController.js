import bcryptjs from "bcryptjs";
import { Role, User, Tenants } from "../Database/Models/index.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
import {
  RESPONSE_STATUS,
  STATUS,
  ROLES,
  TOKEN_VALIDITY_INTERVAL,
  HOURS,
} from "../../Constants.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import moment from "moment";
import sequelize from "../Database/Database.js";

const authController = {};
config();
const { JWT_SECRET, JWT_EXPIRATION_TIME, JWT_EXPIRATION_TIME_ADMIN } =
  process.env;
authController.login = async (req, res) => {
  var { username, password } = req.body;
  const { _username, _password } = sanitizeObject({ username, password });
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
                username,
                role: assignedRole,
                tenant: tenant?.id,
              },
              JWT_SECRET,
              {
                expiresIn:
                  role === ROLES.SUPER_ADMIN.VALUE || role === ROLES.ADMIN.VALUE
                    ? JWT_EXPIRATION_TIME_ADMIN
                    : JWT_EXPIRATION_TIME,
              }
            );
            res.cookie("sid", jwtToken, { path: "/" });
            if (assignedRole) {
              res.cookie("role", assignedRole, { path: "/" });
            }
            res.send({
              message: "Successful login.",
              status: STATUS.SUCCESS,
              role: assignedRole,
            });
          } else {
            removeCookies(res);
            res.status(RESPONSE_STATUS.FORBIDDEN_403).send({
              message:
                "Wrong username/password./ग़लत उपयोगकर्ता नाम / पासवर्ड।",
              status: STATUS.FAILURE,
            });
          }
        } else {
          removeCookies(res);
          res.status(RESPONSE_STATUS.OK_200).send({
            message:
              "You are temprorarily inactive. Please contact admin./आप अस्थायी रूप से निष्क्रिय हैं। कृपया व्यवस्थापक से संपर्क करें।",
            status: STATUS.FAILURE,
          });
        }
      } else {
        removeCookies(res);
        res.status(RESPONSE_STATUS.FORBIDDEN_403).send({
          message: "Wrong username/password./ग़लत उपयोगकर्ता नाम / पासवर्ड।",
          status: STATUS.FAILURE,
        });
      }
    })
    .catch((e) => {
      removeCookies(res);
      console.trace(e);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send(e);
    });
};

export const removeCookies = (res) => {
  res.clearCookie("sid", { path: "/" });
  res.clearCookie("role", { path: "/" });
};

authController.validity = async (req, res) => {
  // Check isActive
  var { username, otp, password } = req.body;
  const { _username, _otp, _password } = sanitizeObject({
    username,
    otp,
    password,
  });
  User.findOne({
    where: {
      username: _username,
      token: _otp,
    },
  })
    .then(async (result) => {
      if (result) {
        const { isActive, validTill } = result.toJSON();
        if (isActive) {
          if (moment().isSameOrBefore(moment(validTill))) {
            const salt = bcryptjs.genSaltSync(10);
            const hashedPassword = bcryptjs.hashSync(_password, salt);
            await sequelize
              .query(
                `UPDATE Users SET password='${hashedPassword}',username="${_username}",token=${null},validTill=${null} WHERE username='${_username}' and token='${_otp}'`
              )
              .then((result) => {
                const [resultUpdated] = result;
                if (resultUpdated) {
                  const parsedResult = JSON.parse(
                    JSON.stringify(resultUpdated)
                  );
                  if (parsedResult?.affectedRows > 0) {
                    res.status(RESPONSE_STATUS.OK_200).send({
                      message: `Password Changed./पासवर्ड बदला गया।`,
                      status: STATUS.SUCCESS,
                    });
                  } else {
                    res.status(RESPONSE_STATUS.OK_200).send({
                      message:
                        "Unable to reset password./पासवर्ड रीसेट करने में असमर्थ।",
                      status: STATUS.FAILURE,
                    });
                  }
                } else {
                  res.status(RESPONSE_STATUS.OK_200).send({
                    message:
                      "Unable to reset password./पासवर्ड रीसेट करने में असमर्थ।",
                    status: STATUS.FAILURE,
                  });
                }
              })
              .catch((e) => {
                console.trace(e);
                res.status(RESPONSE_STATUS.OK_200).send({
                  message:
                    "Unable to reset password./पासवर्ड रीसेट करने में असमर्थ।",
                  status: STATUS.FAILURE,
                });
              });
          } else {
            // Token Expired
            res.status(RESPONSE_STATUS.OK_200).send({
              message:
                "OTP Expired. Please request Again./ ओटीपी समाप्त हो गया। कृपया पुनः अनुरोध करें।",
              status: STATUS.FAILURE,
            });
          }
        } else {
          res.status(RESPONSE_STATUS.OK_200).send({
            status: STATUS.FAILURE,
            message:
              "You are blocked. Please talk to admin./आपको ब्लॉक कर दिया गया है। कृपया व्यवस्थापक से बात करें।",
          });
        }
      } else {
        res.status(RESPONSE_STATUS.OK_200).send({
          status: STATUS.FAILURE,
          message: "Wrong username and OTP/गलत उपयोगकर्ता नाम और ओटीपी",
        });
      }
    })
    .catch((e) => {
      console.trace(e);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
        message: "Unable to reset password./पासवर्ड रीसेट करने में असमर्थ।",
        status: STATUS.FAILURE,
      });
    });
};

authController.resetToken = async (req, res) => {
  const { id, username } = req.body;
  const { _id, _username } = sanitizeObject({ id, username });
  const token = Math.random().toString().substring(2, 8);
  const validTill = moment()
    .add(TOKEN_VALIDITY_INTERVAL, HOURS)
    .format("YYYY-MM-DD HH:mm:ss");
  await sequelize
    .query(
      `UPDATE Users SET token='${token}',validTill='${validTill}' WHERE username='${_username}' and id=${_id}`
    )
    .then((result) => {
      const [resultUpdated] = result;
      if (resultUpdated) {
        const parsedResult = JSON.parse(JSON.stringify(resultUpdated));
        console.log(parsedResult);
        if (parsedResult?.affectedRows > 0) {
          res.status(RESPONSE_STATUS.OK_200).send({
            message: `Token Changed. Validity extended for ${TOKEN_VALIDITY_INTERVAL} ${HOURS}`,
            status: STATUS.SUCCESS,
            token,
            validTill,
          });
        } else {
          res.status(RESPONSE_STATUS.OK_200).send({
            message: "Unable to change Token.",
            status: STATUS.FAILURE,
          });
        }
      } else {
        res.status(RESPONSE_STATUS.OK_200).send({
          message: "Unable to change Token.",
          status: STATUS.FAILURE,
        });
      }
    })
    .catch((e) => {
      console.trace(e);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
        message: "Unable to change Token.",
        status: STATUS.FAILURE,
      });
    });
};
export default authController;
