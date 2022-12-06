import { DataTypes } from "sequelize";
import sequelize from "../Database.js";

const Tenants = sequelize.define(
  "Tenants",
  {
    name: {
      type: DataTypes.STRING,
    },
    branch: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

export default Tenants;
