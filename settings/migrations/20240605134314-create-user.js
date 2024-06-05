'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull:false
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull:false
      },
      lastName: {
        type: Sequelize.STRING(255),
        allowNull:false
      },
      userName: {
        type: Sequelize.STRING(255),
        allowNull:false
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};