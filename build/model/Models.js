"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Statement = exports.Transaction = exports.AccountDetails = exports.User = void 0;
const sequelize_1 = require("sequelize");
const dbServer_1 = require("../db/dbServer");
class User extends sequelize_1.Model {
}
exports.User = User;
class AccountDetails extends sequelize_1.Model {
}
exports.AccountDetails = AccountDetails;
class Transaction extends sequelize_1.Model {
}
exports.Transaction = Transaction;
class Statement extends sequelize_1.Model {
}
exports.Statement = Statement;
User.init({
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    userName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize: dbServer_1.connection,
    modelName: "User",
    tableName: "Users",
});
AccountDetails.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: "Users",
            key: "id",
        },
    },
    accountNum: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    accountBalance: {
        type: sequelize_1.DataTypes.DECIMAL(17, 2),
        allowNull: false,
    },
}, {
    sequelize: dbServer_1.connection,
    modelName: "AccountDetails",
    tableName: "AccountDetails",
});
Transaction.init({
    accountId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "AccountDetails",
            key: "id",
        },
    },
    transactionType: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["credit", "debit"],
        allowNull: false,
    },
    transactionAmount: {
        type: sequelize_1.DataTypes.DECIMAL(17, 2),
        allowNull: false,
    },
    transactionDestination: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    destinationBank: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    transactionDate: {
        type: sequelize_1.DataTypes.DATE(6),
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: dbServer_1.connection,
    modelName: "Transaction",
    tableName: "Transactions",
});
Statement.init({
    accountId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "AccountDetails",
            key: "id",
        },
    },
    generatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    statementData: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
}, {
    sequelize: dbServer_1.connection,
    modelName: "Statement",
    tableName: "Statements",
});
