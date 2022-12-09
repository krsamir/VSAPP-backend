import { Role, User, Tenants } from "../Database/Models/index.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
import { RESPONSE_STATUS, STATUS, ROLES } from "../../Constants.js";
import { config } from "dotenv";
const tenantController = {};
config();

const { JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;

tenantController.getTenant = async (req, res) => {
  res.send([]);
};

export default tenantController;
