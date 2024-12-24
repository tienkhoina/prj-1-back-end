const { spawnSync, spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

// Đường dẫn đến script Python và môi trường ảo
const scriptPath = path.resolve(__dirname, '../python/main.py');
const activateEnvPath = path.resolve(__dirname, '../python/env/bin/activate'); // Đường dẫn môi trường ảo trên Linux

// Hàm kích hoạt môi trường ảo (nếu cần)
function activateVirtualEnv() {
  const activateProcess = spawnSync('bash', ['-c', `source ${activateEnvPath} && echo "Activated virtualenv"`], {
    stdio: 'inherit',
  });

  if (activateProcess.error) {
    console.error('Không thể kích hoạt môi trường ảo:', activateProcess.error);
    process.exit(1);
  }
}

// Hàm gửi câu hỏi tới script Python và nhận kết quả trả về
function askQuestion(question, clinicInfo) {
  return new Promise((resolve, reject) => {
    const dataToSend = JSON.stringify({ question: question, clinicInfo: clinicInfo });

    // Tạo quá trình chạy script Python với tham số
    const pythonProcess = spawn('python3', [scriptPath, dataToSend]); // Sử dụng python3

    let response = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      response += data.toString('utf8');
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString('utf8');
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        console.error(`stderr: ${errorOutput}`);
        reject(`Python script lỗi với code ${code}. stderr: ${errorOutput}`);
      } else {
        resolve(response.trim());
      }
    });
  });
}

// Hàm thiết lập giao diện và nhận đầu vào từ người dùng
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Hàm nhận đầu vào và xử lý
async function getUserInput() {
  try {
    // Lấy thông tin phòng khám từ hàm generatePrompt
    const clinicInfo = { name: 'Phòng khám A', address: 'Địa chỉ 123' }; // Thay bằng cách lấy thông tin thực tế
    console.log('Thông tin phòng khám đã sẵn sàng:', clinicInfo);

    const rl = createReadlineInterface();

    const handleInput = async () => {
      rl.question('Nhập câu hỏi của bạn (hoặc "exit" để thoát): ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log('Đã thoát khỏi chương trình.');
          rl.close();
          return;
        }

        try {
          const response = await askQuestion(input, clinicInfo);
          console.log(`Câu trả lời từ Python: ${response}`);
        } catch (error) {
          console.error(`Lỗi: ${error}`);
        } finally {
          handleInput(); // Tiếp tục nhận câu hỏi
        }
      });
    };

    handleInput(); // Bắt đầu vòng lặp nhập
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phòng khám:', error);
    process.exit(1); // Thoát nếu không thể lấy thông tin phòng khám
  }
}

// Kích hoạt môi trường ảo và bắt đầu chương trình
activateVirtualEnv();
getUserInput();

module.exports = { askQuestion, activateVirtualEnv };
