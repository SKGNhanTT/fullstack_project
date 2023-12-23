import db from '../models';

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name ||
                !data.address ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.imageBase64
            ) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                let res = await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                if (res) {
                    resolve({
                        errCode: 0,
                        errMess: 'Ok',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString(
                        'binary'
                    );
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMess: 'Ok',
                data,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: { id },
                    attributes: [
                        'descriptionHTML',
                        'descriptionMarkdown',
                        'name',
                        'address',
                    ],
                });
                if (data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: id },
                        attributes: ['doctorId'],
                    });

                    data.doctorClinic = doctorClinic;
                } else data = {};
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

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
};
