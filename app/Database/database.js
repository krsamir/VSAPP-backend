import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.trace("Unable to connect to the database:", error);
}

export default sequelize;
