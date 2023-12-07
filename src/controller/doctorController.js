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

module.exports = {
    getTopDoctorHome,
};
