import { Tenants } from "../Database/Models/index.js";
import { sanitizeObject } from "../../Utilities/ObjectHandlers.js";
import {
  RESPONSE_STATUS,
  SEQUELIZE_UNIQUE_CONSTRAINT,
  STATUS,
} from "../../Constants.js";
import { config } from "dotenv";
import sequelize from "../Database/Database.js";
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
  const { id, name, branch, status } = req.body;
  await sequelize
    .query(
      `UPDATE Tenants SET name="${name}",branch="${branch}",status=${status} WHERE id=${id}`
    )
    .then((response) => {
      const [result] = response;
      if (result) {
        const parsedResult = JSON.parse(JSON.stringify(result));
        if (parsedResult?.affectedRows > 0) {
          res
            .status(RESPONSE_STATUS.OK_200)
            .send({ message: "Tenant Updated.", status: STATUS.SUCCESS });
        } else {
          res
            .status(RESPONSE_STATUS.OK_200)
            .send({ message: "No changes.", status: STATUS.FAILURE });
        }
      } else {
        res.status(RESPONSE_STATUS.OK_200).send({
          message: "Unable to update tenant.",
          status: STATUS.FAILURE,
        });
      }
    })
    .catch((e) => {
      if (e.name === SEQUELIZE_UNIQUE_CONSTRAINT) {
        res.status(RESPONSE_STATUS.OK_200).send({
          message: "Duplicate Value exists.",
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

tenantController.deleteTenant = async (req, res) => {
  const { id } = req.params;
  await Tenants.destroy({
    where: {
      id,
    },
  })
    .then((response) => {
      if (response === 1) {
        res
          .status(RESPONSE_STATUS.OK_200)
          .send({ message: "Tenant Deleted.", status: STATUS.SUCCESS });
      } else {
        res.status(RESPONSE_STATUS.OK_200).send({
          message: "Some issue while Deleting Tenant",
          status: STATUS.FAILURE,
        });
      }
    })
    .catch((e) => {
      console.trace(e);
      res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send({
        message: `Issue while Deleting tenant`,
        status: STATUS.FAILURE,
      });
    });
};
export default tenantController;
