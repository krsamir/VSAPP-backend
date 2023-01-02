export const ROLES = Object.freeze({
  USER: {
    ID: 3,
    NAME: "user",
    VALUE: "1643951347925",
  },
  ADMIN: {
    ID: 2,
    NAME: "admin",
    VALUE: "1643951279554",
  },
  SUPER_ADMIN: {
    ID: 1,
    NAME: "super_admin",
    VALUE: "1645361933757",
  },
});

export const RESPONSE_STATUS = Object.freeze({
  OK_200: 200,
  CREATED_201: 201,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,
  INTERNAL_SERVER_ERROR_500: 500,
});

export const STATUS = Object.freeze({
  FAILURE: 0,
  SUCCESS: 1,
  DUPLICATE: 2,
});

export const SEQUELIZE_UNIQUE_CONSTRAINT = "SequelizeUniqueConstraintError";

export const TOKEN_VALIDITY_INTERVAL = 2;
export const TOKEN_VALIDITY_INTERVAL_5 = 5;
export const HOURS = `hours`;
export const MINUTES = "minutes";
