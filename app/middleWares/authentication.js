import jwt from "jsonwebtoken";
import env from "dotenv";
import { RESPONSE_STATUS, STATUS } from "../../Constants.js";
env.config();

export const isAuthenticated = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    token = token.replace("Bearer ", "");
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    req.username = decoded.username;
    req.role = decoded.role;
    next();
  } catch (e) {
    removeCookies(res);
    console.log({
      message: `AUTHENTICATION REQUIRED. PLEASE LOGIN AGAIN.`,
      status: STATUS.FAILURE,
    });
    res.status(RESPONSE_STATUS.UNAUTHORIZED_401).send({
      message: `AUTHENTICATION REQUIRED. PLEASE LOGIN AGAIN.`,
      status: STATUS.FAILURE,
    });
  }
};

export const removeCookies = (res) => {
  res.clearCookie("sid", { path: "/" });
  res.clearCookie("role", { path: "/" });
};
