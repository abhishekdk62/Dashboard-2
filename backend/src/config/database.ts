import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbUrl =
  process.env.NODE_ENV === "development"
    ? process.env.EXTERNAL_DB_URL
    : process.env.INTERNAL_DB_URL;

if (!dbUrl) {
  throw new Error("Database URL is not defined");
}

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
