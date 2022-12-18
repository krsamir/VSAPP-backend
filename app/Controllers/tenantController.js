import { Tenants } from "../Database/Models/index.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
import {
  RESPONSE_STATUS,
  SEQUELIZE_UNIQUE_CONSTRAINT,
  STATUS,
} from "../../Constants.js";
import { config } from "dotenv";
const tenantController = {};
config();

tenantController.getTenant = async (req, res) => {
  await Tenants.findAll()
    .then((response) => {
      res
        .status(RESPONSE_STATUS.OK_200)
        .send({ message: "", data: response, status: STATUS.SUCCESS });
    })
    .catch((e) => {
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
        data: e,
        status: STATUS.FAILURE,
        message: "Issue while getting tenants.",
      });
    });
};

tenantController.createTenant = async (req, res) => {
  const { name, branch } = req.body;
  const { _name, _branch } = sanitizeObject({ name, branch });
  await Tenants.create({ name: _name, branch: _branch })
    .then((data) => {
      res
        .status(RESPONSE_STATUS.CREATED_201)
        .send({ status: STATUS.SUCCESS, data, message: "Tenant Created." });
    })
    .catch((e) => {
      if (e.name === SEQUELIZE_UNIQUE_CONSTRAINT) {
        res.status(RESPONSE_STATUS.OK_200).send({
          message: "Tenant already exists.",
          issue: e.errors.map(({ message }) => message),
          status: STATUS.DUPLICATE,
        });
      } else {
        console.trace(e);
        res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
          message: `Issue while creating tenant`,
          status: STATUS.FAILURE,
        });
      }
    });
};

tenantController.updateTenant = async (req, res) => {
  const { id, name, branch } = req.body;
  const { _id, _name, _branch } = sanitizeObject({ id, name, branch });

  res.send({ _id, _name, _branch });
  // await Tenants.create({ name: _name, branch: _branch })
  //   .then((data) => {
  //     res
  //       .status(RESPONSE_STATUS.CREATED_201)
  //       .send({ status: STATUS.FAILURE, data, message: "Tenant Created." });
  //   })
  //   .catch((e) => {
  //     if (e.name === SEQUELIZE_UNIQUE_CONSTRAINT) {
  //       res.status(RESPONSE_STATUS.OK_200).send({
  //         message: "Duplicate Value exists.",
  //         issue: e.errors.map(({ message }) => message),
  //         status: STATUS.FAILURE,
  //       });
  //     } else {
  //       console.trace(e);
  //       res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
  //         message: `Issue while creating tenant`,
  //         status: STATUS.FAILURE,
  //       });
  //     }
  //   });
};
export default tenantController;
