import { RESPONSE_STATUS, ROLES, STATUS } from "../../Constants.js";

export const CHECK_TENANT = (req, res, next) => {
  const { role, tenant } = req;
  if (role === ROLES.ADMIN.VALUE && (tenant === undefined || tenant === null)) {
    res.status(RESPONSE_STATUS.OK_200).send({
      message: `You don't have valid access to perform this activity.`,
      status: STATUS.FAILURE,
    });
  } else {
    next();
  }
};
