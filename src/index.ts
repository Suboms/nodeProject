import { User, AccountDetails, Transaction, Statement } from "./model/Models";
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




const server = async () => {
  try {
    expressApp(app); 
    app.listen(process.env.PORT, () => {
      console.log(`Bank server has started on ${process.env.PORT}` );
    });
  } catch (error:any) {
    console.error("Error starting the server:", error.message); 
  }
 
};

server();
