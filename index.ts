import { connection } from "./db/dbServer"; 
import { User, AccountDetails, Transaction, Statement } from "./models/Models";
import express from "express";
import { expressApp } from "./app"; 

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


const dbServer = async () => {
  try {
    await connection.authenticate();
    await connection.sync({ force: true }); 
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database & tables:", error);
  }
};

const server = async () => {
  try {
    expressApp(app); 
    await dbServer();
    app.listen(5050, () => {
      console.log("Hive Server has Started");
    });
  } catch (error:any) {
    console.error("Error starting the server:", error.message); 
  }
};

server();
