import { DataTypes } from "sequelize";
import bcryptjs from "bcryptjs";
import sequelize from "../Database.js";
import Role from "./Role.js";
import Tenants from "./Tenants.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(value, salt);
        this.setDataValue("password", hashedPassword);
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    validTill: {
      type: DataTypes.DATE,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {}
);

User.belongsTo(Tenants, { as: "tenant" });
User.belongsTo(Role, { as: "role" });

export default User;
