const { query } = require('express');
const db = require('../models/index');
const { Error, where } = require('sequelize');



let insertBookings = async (doctorId, patientId, date, timeType) => {
    try {
        const newBooking = await db.Booking.create(
            {
                statusId: "S1",
                doctorId: doctorId,
                patientID: patientId,
                date: date,
                timeType: timeType,
            }
        );

        // Trả về thông tin phần tử vừa tạo
        return newBooking;
    } catch (e) {
        throw new Error(e); // Thêm lỗi nếu có
    }
};

let deleteBookings = async (doctorId, patientId, date, timeType) => {
    let booking = await db.Booking.findOne({
        raw: true,
        where: {
            statusId: "S1",
            doctorId: doctorId,
            patientID: patientId,
            date: date,
            timeType: timeType,
        }
    })

    const result = await db.Booking.destroy({
        where: {
            id: booking.id, // Điều kiện xóa
        },
    });

    return result;
}

let insertSchedules = async (doctorId, date, timeType) => {
    try {
        await db.Schedule.create({
            doctorId: doctorId,
            date: date,
            timeType: timeType,
        });
    } catch (e) {
        throw new Error(e); // Thêm lỗi nếu có
    }
}
let deleteSchedules = async (doctorId, date, timeType) => {
    try {
        let schedule = await db.Schedule.findOne({
            raw: true,
            where: {
                doctorId: doctorId,
                date: date,
                timeType: timeType,
            }
        });
        const result = await db.Schedule.destroy({
            where: {
                id: schedule.id, // Điều kiện xóa
            },
        });
        return result;
    } catch (e) {
        throw new Error(e); // Thêm lỗi nếu có
    }
}

let getAllBookings = async () => {
    try {
        const query = `SELECT 
    CONCAT(u1.firstName, ' ', u1.lastName) AS pName,
    u1.image,
    CONCAT('Dr. ', u2.firstName, ' ', u2.lastName) AS dName,
    doctorinfos.appointmentFee AS fees,
    bookings.date
FROM 
    Users u1
JOIN 
    bookings ON bookings.patientID = u1.id 
JOIN 
    Users u2 ON u2.id = bookings.doctorId 
JOIN 
    doctorinfos ON doctorinfos.doctorId = u2.id 
ORDER BY 
    bookings.date DESC;`
        const [results, metadata] = await db.sequelize.query(query);
        return results;
    } catch (e) {
        throw new Error(e);
    }
}

let getBookingsByPatientId = async (patientId) => {
    try {
        let bookings = await db.Booking.findAll({
            raw: true,
            where: {
                patientId: patientId,
            },
        });
        return bookings;
    } catch (e) {
        throw new Error(e);
    }
}

let checkPatientBooking = async (patientId, date, timeType) => {

    try {
        let bookings = await db.Booking.findAll({
            raw: true,
            where: {
                patientId: patientId,
                date: date,
                timeType: timeType,
            },
        });
        return bookings.length > 0;
    } catch (e) {
        throw new Error(e);
    }
}

let getDoctorInvolve = async (userId) => {
    const query = `SELECT 
    u2.*, 
    bookings.timeType, 
    bookings.date, 
    prebookinginfos.info
FROM 
    Users u1
JOIN 
    bookings ON bookings.patientID = u1.id
JOIN 
    Users u2 ON u2.id = bookings.doctorId
LEFT JOIN 
    prebookinginfos ON prebookinginfos.bookingId = bookings.id
WHERE 
    u1.id = ${userId};`;


    const [results, metadata] = await db.sequelize.query(query);
   
    let doctors = []
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const gmt7 = new Date(utc + 14 * 3600000);

    const timeSlotMapping = {
        T1: "08:00:00",
        T2: "09:00:00",
        T3: "10:00:00",
        T4: "11:00:00",
        T5: "14:00:00",
        T6: "15:00:00",
        T7: "16:00:00",
        T8: "17:00:00",
    };


    for (let doc of results) {

        let doctor = {
            _id: 'doc' + doc.id,
            name: 'Dr. ' + doc.firstName + ' ' + doc.lastName,
            image: doc.image,
            date: doc.date,
            timeType: doc.timeType,
            preMessage: doc.info,
            address: {
                line1: doc.address,
                line2: ''
            }
        }

        const [hours, minutes, seconds] = timeSlotMapping[doctor.timeType].split(":").map(Number);

      
        doctor.date.setHours(hours + 7, minutes, seconds, 0);
        doctor.date.toISOString()
        if (doctor.date >= gmt7) {
            doctors.push(doctor)
        }
    }

    

    return doctors;

}

let getPatientInvolve = async (userId) => {
    const query = `SELECT u1.*,bookings.timeType,bookings.date from Users u1 join bookings on bookings.patientID =u1.id join Users u2 on u2.id =bookings.doctorId where u2.id=${userId}`;


    const [results, metadata] = await db.sequelize.query(query);

    let doctors = []
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const gmt7 = new Date(utc + 14 * 3600000);

    const timeSlotMapping = {
        T1: "08:00:00",
        T2: "09:00:00",
        T3: "10:00:00",
        T4: "11:00:00",
        T5: "14:00:00",
        T6: "15:00:00",
        T7: "16:00:00",
        T8: "17:00:00",
    };

    for (let doc of results) {

        let doctor = {
            _id: doc.id,
            name: doc.firstName + ' ' + doc.lastName,
            image: doc.image,
            date: doc.date,
            timeType: doc.timeType,
            address: {
                line1: doc.address,
                line2: ''
            }
        }

        const [hours, minutes, seconds] = timeSlotMapping[doctor.timeType].split(":").map(Number);
        doctor.date.setHours(hours + 7, minutes, seconds, 0);
        doctor.date.toISOString()
        if (doctor.date >= gmt7) {
            doctors.push(doctor)
        }
    }

    return doctors;
}

let getPreviousPatientsInvolve = async (userId) => {
    const query = `SELECT u1.*,bookings.timeType,bookings.date from Users u1 join bookings on bookings.patientID =u1.id join Users u2 on u2.id =bookings.doctorId where u2.id=${userId}`;


    const [results, metadata] = await db.sequelize.query(query);

    let doctors = []
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const gmt7 = new Date(utc + 14 * 3600000);

    const timeSlotMapping = {
        T1: "08:00:00",
        T2: "09:00:00",
        T3: "10:00:00",
        T4: "11:00:00",
        T5: "14:00:00",
        T6: "15:00:00",
        T7: "16:00:00",
        T8: "17:00:00",
    };

    for (let doc of results) {

        let doctor = {
            _id: doc.id,
            name: doc.firstName + ' ' + doc.lastName,
            image: doc.image,
            date: doc.date,
            timeType: doc.timeType,
            address: {
                line1: doc.address,
                line2: ''
            }
        }

        const [hours, minutes, seconds] = timeSlotMapping[doctor.timeType].split(":").map(Number);
        doctor.date.setHours(hours + 7, minutes, seconds, 0);
        doctor.date.toISOString()
        if (doctor.date < gmt7) {
            doctors.push(doctor)
        }
    }

    return doctors;
}



let addCheckSaw = async (message, doctorId, patientId) => {
  try {
    const newRecord = await db.Sawbook.create({
      doctorId: doctorId,
        patientId: patientId,
        patientCheck: message === 1 ? 0 : 1,
        doctorCheck: message === 1 ? 1 : 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    console.log('Insert thành công:', newRecord.toJSON());
    return newRecord;
  } catch (error) {
    console.error('Lỗi khi insert dữ liệu:', error);
    throw error;
  }
};




let deleteCheckSaw = async (message, id) => {
  try {
    let deleteCondition = {};

    if (message == 0) {
      // Xóa mọi bản ghi có patientId = patientId
      deleteCondition = { patientId: id };
    } else {
      // Xóa mọi bản ghi có doctorId = doctorId
      deleteCondition = { doctorId: id };
    }

    // Thực hiện xóa bản ghi
    const deletedRows = await db.Sawbook.destroy({
      where: deleteCondition
    });

    console.log(`Đã xóa ${deletedRows} bản ghi thành công.`);
    return deletedRows;
  } catch (error) {
    console.error('Lỗi khi xóa bản ghi:', error);
    throw error;
  }
};


let getCheckSaw = async (message, id) => {
  try {
    let whereCondition = {};

    if (message == 0) {
      // Trả về các bản ghi có patientCheck = 1
      whereCondition = { patientId: id, patientCheck: 0 };
    } else {
      // Trả về các bản ghi có doctorCheck = 1
      whereCondition = { doctorId: id, doctorCheck: 0 };
    }

    // Thực hiện tìm kiếm bản ghi
    const records = await db.Sawbook.findAll({
      where: whereCondition
    });

    console.log("Các bản ghi tìm thấy:", records);
    return records;
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error);
    throw error;
  }
};

let insertPreInfo = async (id, info) => {
    await db.Prebookinginfo.create({
        bookingId: id,
        info: info,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}


module.exports = {
    insertPreInfo,getCheckSaw,deleteCheckSaw,addCheckSaw,insertBookings, insertSchedules, getAllBookings, getBookingsByPatientId,
    checkPatientBooking, getDoctorInvolve, deleteBookings, deleteSchedules, getPatientInvolve, getPreviousPatientsInvolve, getAllBookings
}