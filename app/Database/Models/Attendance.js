import { DataTypes } from "sequelize";
import sequelize from "../Database.js";
import User from "./User.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    markedOn: {
      type: DataTypes.DATEONLY,
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
  {
    indexes: [
      {
        unique: true,
        fields: ["markedOn", "userId"],
      },
    ],
  }
);

export default Attendance;
