import { DataTypes, Model } from "sequelize";
import { connection } from "../db/dbServer";

class User extends Model {}
class AccountDetails extends Model {}
class Transaction extends Model {}
class Statement extends Model {}

User.init(
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize: connection, 
    modelName: "User",
    tableName: "Users",
  }
);

AccountDetails.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Users", 
        key: "id",
      },
    },
    accountNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    accountBalance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    sequelize: connection, 
    modelName: "AccountDetails",
    tableName: "AccountDetails",
  }
);

Transaction.init(
  {
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "AccountDetails",
        key: "id",
      },
    },
    transactionType: {
      type: DataTypes.ENUM,
      values: ["credit", "debit"],
      allowNull: false,
    },
    transactionAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transactionDate: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: connection,
    modelName: "Transaction",
    tableName: "Transactions",
  }
);

Statement.init(
  {
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AccountDetails,
        key: "id",
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    generatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    statementData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "Statement",
    tableName: "Statements",
  }
);

export { User, AccountDetails, Transaction, Statement };
