import specialtyService from '../services/specialtyService';

let createSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMess: 'Error from server!',
        });
    }
};

let getAllSpeicalty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpeicalty();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMess: 'Error from server!',
        });
    }
};

let getDetailSpecialtyById = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialtyById(
            req.query.id,
            req.query.location
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMess: 'Error from server!',
        });
    }
};

module.exports = {
    createSpecialty,
    getAllSpeicalty,
    getDetailSpecialtyById,
};
