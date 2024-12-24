const Sequelize = require('sequelize');

// Cấu hình kết nối tới MySQL sử dụng cổng 3306
const sequelize = new Sequelize('sql12753842', 'sql12753842', "8uG6yyryVz", {
    host: 'sql12.freesqldatabase.com',
    dialect: 'mysql',
    port: 3306, // Chỉ định cổng 3306
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

