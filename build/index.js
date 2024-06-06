"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Models_1 = require("./model/Models");
const express_1 = __importDefault(require("express"));
const app_1 = require("./app");
const dbServer_1 = require("./db/dbServer");
const app = (0, express_1.default)();
// Define associations between models
Models_1.User.hasOne(Models_1.AccountDetails, {
    foreignKey: "userId",
    onDelete: "RESTRICT",
});
Models_1.AccountDetails.belongsTo(Models_1.User, {
    foreignKey: "userId",
});
Models_1.AccountDetails.hasMany(Models_1.Transaction, {
    foreignKey: "accountId",
    onDelete: "RESTRICT",
});
Models_1.Transaction.belongsTo(Models_1.AccountDetails, {
    foreignKey: "accountId",
});
Models_1.AccountDetails.hasMany(Models_1.Statement, {
    foreignKey: "accountId",
    onDelete: "RESTRICT",
});
Models_1.Statement.belongsTo(Models_1.AccountDetails, {
    foreignKey: "accountId",
});
const syncDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbServer_1.connection.authenticate();
        console.log("Database is connected and tables are synced");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
    }
});
const server = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, app_1.expressApp)(app);
        yield syncDB();
        app.listen(process.env.PORT, () => {
            console.log(`Bank server has started on ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error.message);
    }
});
server();
