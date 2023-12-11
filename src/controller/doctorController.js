import doctorService from '../services/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.body.limit;
    if (!limit) limit = 10;
    try {
        let doctor = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(doctor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMess: 'Error from server...',
        });
    }
};

let getAllDoctor = async (req, res) => {
    try {
        let doctor = await doctorService.getAllDoctor();
        return res.status(200).json(doctor);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMess: 'Error from server!',
        });
    }
};

let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMess: 'Error from server!',
        });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMess: 'Error from server!!',
        });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMess: 'Error from server!!',
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleByDate(
            req.query.doctorId,
            req.query.date
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
    getTopDoctorHome,
    getAllDoctor,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
};
