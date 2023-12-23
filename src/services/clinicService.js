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

module.exports = {
    createClinic,
};
