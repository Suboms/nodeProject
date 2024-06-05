'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.AccountDetails, {
        foreignKey: "accountId",
      });
    }
  }
  Transaction.init({
    accountId: DataTypes.INTEGER,
    transactionType: DataTypes.ENUM,
    transactionAmount: DataTypes.DECIMAL,
    transactionDestination: DataTypes.BIGINT,
    destinationBank: DataTypes.STRING,
    description: DataTypes.TEXT,
    transactionDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};