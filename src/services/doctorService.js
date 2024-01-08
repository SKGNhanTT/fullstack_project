import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findAll({
                limit,
                where: { roleId: 'R2 ' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueEn', 'valueVi'],
                    },
                    {
                        model: db.Allcode,
                        as: 'genderData',
                        attributes: ['valueEn', 'valueVi'],
                    },
                    {
                        model: db.Markdown,
                        attributes: ['specialtyNameEn', 'specialtyNameVi'],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: user,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'],
                },
            });

            resolve({
                errCode: 0,
                data: doctor,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let checkRequiredFields = (inputData) => {
    let arr = [
        'doctorId',
        'contentHTMLEn',
        'contentHTMLVi',
        'contentMarkdownEn',
        'contentMarkdownVi',
        'action',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        // 'nameClinic',
        'addressClinic',
        'noteEn',
        'noteVi',
    ];
    let isValid = true;
    let element = '';
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            element = arr[i];
            isValid = false;
            break;
        }
    }
    return {
        isValid: isValid,
        element: element,
    };
};

let saveDetailInfoDoctor = ({ data }) => {
    return new Promise(async (resolve, reject) => {
        console.log(data);
        try {
            let checkObj = checkRequiredFields(data);
            if (!checkObj.isValid) {
                resolve({
                    errCode: 1,
                    errMess: `Missing parameter: ${checkObj.element}!`,
                });
            } else {
                // upsert to Markdown
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTMLEn: data.contentHTMLEn,
                        contentHTMLVi: data.contentHTMLVi,
                        contentMarkdownEn: data.contentMarkdownEn,
                        contentMarkdownVi: data.contentMarkdownVi,
                        descriptionEn: data.descriptionEn,
                        descriptionVi: data.descriptionVi,
                        doctorId: data.doctorId,
                        specialtyNameEn: data.specialtyNameEn
                            ? data.specialtyNameEn
                            : '',
                        specialtyNameVi: data.specialtyNameVi
                            ? data.specialtyNameVi
                            : '',
                    });
                } else if (data.action === 'EDIT') {
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    });
                    if (markdown) {
                        markdown.contentHTMLEn = data.contentHTMLEn;
                        markdown.contentHTMLVi = data.contentHTMLVi;
                        markdown.contentMarkdownEn = data.contentMarkdownEn;
                        markdown.contentMarkdownVi = data.contentMarkdownVi;
                        markdown.descriptionEn = data.descriptionEn;
                        markdown.descriptionVi = data.descriptionVi;
                        markdown.specialtyNameVi = data.specialtyNameVi
                            ? data.specialtyNameVi
                            : '';
                        markdown.specialtyNameEn = data.specialtyNameEn
                            ? data.specialtyNameEn
                            : '';

                        await markdown.save();
                    }
                }
                // upsearch to doctor-infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });

                if (doctorInfor) {
                    doctorInfor.doctorId = data.doctorId;
                    doctorInfor.priceId = data.selectedPrice;
                    doctorInfor.provinceId = data.selectedProvince;
                    doctorInfor.paymentId = data.selectedPayment;
                    doctorInfor.addressClinic = data.addressClinic;
                    doctorInfor.nameClinic = data.nameClinic;
                    doctorInfor.noteEn = data.noteEn;
                    doctorInfor.noteVi = data.noteVi;
                    doctorInfor.specialtyId = data.specialtyId;
                    doctorInfor.clinicId = data.clinicId;
                    await doctorInfor.save();
                } else {
                    await db.Doctor_Infor.create({
                        doctorId: data.doctorId,
                        priceId: data.selectedPrice,
                        provinceId: data.selectedProvince,
                        paymentId: data.selectedPayment,
                        addressClinic: data.addressClinic,
                        nameClinic: data.nameClinic,
                        noteEn: data.noteEn,
                        noteVi: data.noteVi,
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                    });
                }

                resolve({
                    errCode: 0,
                    errMess: 'Save info doctor success!!',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!!',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'descriptionEn',
                                'descriptionVi',
                                'contentHTMLEn',
                                'contentHTMLVi',
                                'contentMarkdownEn',
                                'contentMarkdownVi',
                                'specialtyNameEn',
                                'specialtyNameVi',
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString(
                        'binary'
                    );
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                // check data input from FE
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }
                // check exist database
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true,
                });

                // compare difference
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMess: 'Ok',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if ((!doctorId, !date)) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameters!!',
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId, date },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.User,
                            as: 'doctorData',
                            attributes: ['firstName', 'lastName'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!data) {
                    return (data = []);
                }
                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getExtraInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameters!!',
                });
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'priceTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'paymentTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode,
                            as: 'provinceTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameters!!',
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'descriptionEn',
                                'descriptionVi',
                                'contentHTMLEn',
                                'contentHTMLVi',
                                'contentMarkdownEn',
                                'contentMarkdownVi',
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'priceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'paymentTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                                {
                                    model: db.Allcode,
                                    as: 'provinceTypeData',
                                    attributes: ['valueEn', 'valueVi'],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString(
                        'binary'
                    );
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getListPatientForDoctor = (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                let data = await db.Booking.findAll({
                    where: { statusId: 'S2', doctorId: id, date: date },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: [
                                'email',
                                'firstName',
                                'address',
                                'gender',
                            ],
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'genderData',
                                    attributes: ['valueVi', 'valueEn'],
                                },
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    errMess: 'Ok',
                    data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.patientId ||
                !data.timeType
            ) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                // update status S3

                let res = await db.Booking.findOne({
                    where: {
                        statusId: 'S2',
                        doctorId: data.doctorId,
                        timeType: data.timeType,
                        patientId: data.patientId,
                    },
                    raw: false,
                });
                if (res) {
                    res.statusId = 'S3';
                    await res.save();
                }
                // send email
                await emailService.sendAttachments(data);

                resolve({
                    errCode: 0,
                    errMess: 'Ok',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
};
