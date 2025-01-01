const Sequelize = require('sequelize');

// Cấu hình kết nối tới MySQL sử dụng cổng 3306
const sequelize = new Sequelize('defaultdb', 'avnadmin', "AVNS_tKV_GIC_0jV66T-XNp9", {
    host: 'mysql-6365e85-tienkhoina-5e17.g.aivencloud.com',
    dialect: 'mysql',
    port: 25798, // Chỉ định cổng 3306
    logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;

