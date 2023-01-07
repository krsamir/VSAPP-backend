import { DataTypes } from "sequelize";
import sequelize from "../Database.js";
import Tenants from "./Tenants.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    markedOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approvedBy: {
      type: DataTypes.STRING,
    },
    ApprovedOn: {
      type: DataTypes.DATE,
    },
  },
  {}
);

Attendance.belongsTo(Tenants, { as: "tenant" });

export default Attendance;
