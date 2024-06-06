
import { Sequelize } from "sequelize";
import "dotenv/config";

const dbName = process.env.DB_NAME || "";
const dbUser = process.env.DB_USER || "";
const dbPassword = process.env.DB_PASS || "";
const dbHost = process.env.DB_HOST || "";
const dbPort = parseInt(process.env.DB_PORT ?? "3306");


const connection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    connectTimeout: 60000 // 60 seconds
  },
});

export { connection };
