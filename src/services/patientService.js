import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let builUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.fullName ||
                !data.selectedGender ||
                !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing parameter!',
                });
            } else {
                let token = uuidv4();

                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                    },
                });

                // create a booking record
                if (user && user[0]) {
                    let res = await db.Booking.findOrCreate({
                        where: {
                            // patientId: user[0].id,
                            statusId: 'S1',
                            date: data.date,
                            timeType: data.timeType,
                        },
                        defaults: {
                            statusId: 'S1',
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                        },
                    });
                    if (!res[1]) {
                        resolve({
                            errCode: 3,
                            errMess: 'Save failded',
                        });
                    } else {
                        await emailService.sendSimpleEmail({
                            receiverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: builUrlEmail(data.doctorId, token),
                        });
                    }
                }

                resolve({
                    errCode: 0,
                    errMess: 'Save infor success',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing parameter!',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        token: data.token,
                        doctorId: data.doctorId,
                        statusId: 'S1',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMess: 'Update the appointment succeed!',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMess: 'Booking has been active or does not exits!',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
};
