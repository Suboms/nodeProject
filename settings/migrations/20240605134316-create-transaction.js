"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "AccountDetails",
          key: "id",
        },
      },
      transactionType: {
        type: Sequelize.ENUM,
        values: ["credit", "debit"],
        allowNull: false,
      },
      transactionAmount: {
        type: Sequelize.DECIMAL(17, 2),
        allowNull:false

      },
      transactionDestination: {
        type: Sequelize.BIGINT,
        allowNull:false
      },
      destinationBank: {
        type: Sequelize.STRING,
        allowNull:false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull:false
      },
      transactionDate: {
        type: Sequelize.DATE(6),
        defaultValue: Sequelize.NOW,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
