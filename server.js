const express = require('express');
const connectDB = require('./src/config/database.js');
const cors = require('cors');
const path = require('path');
const db = require('./src/models/index.js');
const webRoutes = require('./src/routes/web.js');

const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Cấu hình middleware cho CORS 
app.use(cors({
    origin: 'https://prj-1-front-end.onrender.com', // Địa chỉ của frontend (bạn có thể thay đổi cho môi trường sản xuất)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Cho phép gửi cookie
}));

// Cấu hình middleware để xử lý JSON và form data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sử dụng định tuyến từ file web.js
app.use('/', webRoutes);

// Thiết lập server (không sử dụng biến môi trường từ .env)
const PORT = 5000;  // Thay thế process.env.PORT bằng giá trị cố định
const HOSTNAME = '0.0.0.0';  // Thay thế process.env.HOSTNAME bằng '0.0.0.0' để ứng dụng có thể chạy trên tất cả các IP

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`);
});
