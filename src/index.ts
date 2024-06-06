import { User, AccountDetails, Transaction, Statement } from "./model/Models";
import express from "express";
import { expressApp } from "./app";
import { connection } from "./db/dbServer";

const app = express();

// Define associations between models
User.hasOne(AccountDetails, {
  foreignKey: "userId",
  onDelete: "RESTRICT",
});
AccountDetails.belongsTo(User, {
  foreignKey: "userId",
});

AccountDetails.hasMany(Transaction, {
  foreignKey: "accountId",
  onDelete: "RESTRICT",
});
Transaction.belongsTo(AccountDetails, {
  foreignKey: "accountId",
});

AccountDetails.hasMany(Statement, {
  foreignKey: "accountId",
  onDelete: "RESTRICT",
});
Statement.belongsTo(AccountDetails, {
  foreignKey: "accountId",
});

const syncDB = async () => {
  try {
    await connection.authenticate();
    console.log("Database is connected and tables are synced");
  } catch (error: any) {
    console.error("Error connecting to the database:", error);
  }
};

const server = async () => {
  try {
    expressApp(app);
    await syncDB();
    app.listen(process.env.PORT, () => {
      console.log(`Bank server has started on ${process.env.PORT}`);
    });
  } catch (error: any) {
    console.error("Error starting the server:", error.message);
  }
};

server();
