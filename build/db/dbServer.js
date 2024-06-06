"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const sequelize_1 = require("sequelize");
require("dotenv/config");
const dbName = process.env.DB_NAME || "";
const dbUser = process.env.DB_USER || "";
const dbPassword = process.env.DB_PASS || "";
const dbHost = process.env.DB_HOST || "";
const dbPort = parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : "3306");
const connection = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
        connectTimeout: 60000 // 60 seconds
    },
});
exports.connection = connection;
