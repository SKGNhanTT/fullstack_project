import db from '../models/index';

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

let saveDetailInfoDoctor = ({ data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.doctorId ||
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.action
            ) {
                resolve({
                    errCode: 1,
                    errMess: 'Missing parameter!',
                });
            } else {
                if (data.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        doctorId: data.doctorId,
                    });
                } else if (data.action === 'EDIT') {
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: data.doctorId },
                        raw: false,
                    });
                    if (markdown) {
                        markdown.contentHTML = data.contentHTML;
                        markdown.contentMarkdown = data.contentMarkdown;
                        markdown.description = data.description;

                        await markdown.save();
                    }
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
                                'description',
                                'contentHTML',
                                'contentMarkdown',
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi'],
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

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInfoDoctor,
    getDetailDoctorById,
};
