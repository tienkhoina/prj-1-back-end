'use strict';

const { sequelize } = require("../models");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('FaceInfo', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId:{
                allowNull:false,
                type: Sequelize.INTEGER
            },
            faceCode:{
                type: Sequelize.TEXT('medium')
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
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('FaceInfo');
    }
};