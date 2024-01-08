import db from '../models/index';

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.nameEn ||
                !data.nameVi ||
                !data.imageBase64 ||
                !data.descriptionHTMLEn ||
                !data.descriptionHTMLVi ||
                !data.descriptionMarkdownEn ||
                !data.descriptionMarkdownVi
            ) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                await db.Specialty.create({
                    nameEn: data.nameEn,
                    nameVi: data.nameVi,
                    addressEn: data.addressEn,
                    addressVi: data.addressVi,
                    image: data.imageBase64,
                    descriptionHTMLEn: data.descriptionHTMLEn,
                    descriptionHTMLVi: data.descriptionHTMLVi,
                    descriptionMarkdownEn: data.descriptionMarkdownEn,
                    descriptionMarkdownVi: data.descriptionMarkdownVi,
                });
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

let getAllSpeicalty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
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

let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing required parameter!',
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: { id },
                    attributes: [
                        'nameEn',
                        'nameVi',
                        'descriptionHTMLEn',
                        'descriptionHTMLVi',
                        'descriptionMarkdownEn',
                        'descriptionMarkdownVi',
                    ],
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: id },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: id, provinceId: location },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    }
                    data.doctorSpecialty = doctorSpecialty;
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
    createSpecialty,
    getAllSpeicalty,
    getDetailSpecialtyById,
};
