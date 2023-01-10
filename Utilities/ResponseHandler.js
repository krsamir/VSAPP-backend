import {
  RESPONSE_STATUS,
  SEQUELIZE_UNIQUE_CONSTRAINT,
  STATUS,
} from "../Constants.js";

export const handleError = (e, res) => {
  if (e.name === SEQUELIZE_UNIQUE_CONSTRAINT) {
    res.status(RESPONSE_STATUS.OK_200).send({
      message: "Duplicate Data.",
      issue: e.errors.map(({ message }) => message),
      status: STATUS.DUPLICATE,
    });
  } else {
    console.trace(e);
    res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
      message: `Some issue while performing this action.`,
      status: STATUS.FAILURE,
    });
  }
};
