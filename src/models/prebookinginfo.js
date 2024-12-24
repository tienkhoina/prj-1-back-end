'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Prebookinginfo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Prebookinginfo.init({
        bookingId: DataTypes.INTEGER,
        info: DataTypes.TEXT,
        createdAt: DataTypes.DATE,
        updatedAt:DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Prebookinginfo',
        tableName: 'prebookinginfos'
    });
    return Prebookinginfo;
};