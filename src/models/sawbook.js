'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sawbook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Sawbook.init({
        patientId: DataTypes.INTEGER,
        doctorId: DataTypes.INTEGER,
        patientCheck: DataTypes.INTEGER,
        doctorCheck: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt:DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Sawbook',
        tableName: 'sawbooks'
    });
    return Sawbook;
};