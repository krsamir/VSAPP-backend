import jwt from "jsonwebtoken";
import env from "dotenv";
import { ROLES, RESPONSE_STATUS, STATUS } from "../../Constants.js";

env.config();

export const CAPABILITY =
  (roles = []) =>
  (req, res, next) => {
    if (roles.length === 0) {
      roles = [ROLES.SUPER_ADMIN.VALUE, ROLES.ADMIN.VALUE, ROLES.USER.VALUE];
    }
    try {
      let token = req.header("Authorization");
      token = token.replace("Bearer ", "");
      // eslint-disable-next-line no-undef
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.includes(decoded.role)) {
        next();
      } else {
        throw Error("Unauthorized to access this page.");
      }
    } catch (e) {
      removeCookies(res);
      console.log({ message: `UNAUTHORIZED ACCESS!!` });
      res
        .status(RESPONSE_STATUS.FORBIDDEN_403)
        .send({ message: `UNAUTHORIZED ACCESS!!`, status: STATUS.FAILURE });
    }
  };

export const removeCookies = (res) => {
  res.clearCookie("sid", { path: "/" });
  res.clearCookie("role", { path: "/" });
};
