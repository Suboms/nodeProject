'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccountDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AccountDetails.belongsTo(models.User, {
        foreignKey: "userId",
      });

      AccountDetails.hasMany(models.Transaction, {
        foreignKey: "accountId",
        onDelete: "RESTRICT",
      });

      AccountDetails.hasMany(models.Statement, {
        foreignKey: "accountId",
        onDelete: "RESTRICT",
      });
    }
  }
  AccountDetails.init({
    userId: DataTypes.INTEGER,
    accountNum: DataTypes.BIGINT,
    accountBalance: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'AccountDetails',
  });
  return AccountDetails;
};