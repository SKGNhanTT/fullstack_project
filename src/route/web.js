import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from '../controller/clinicController';

let router = express.Router();

let initWebRoutes = (app) => {
    // ===============API test=========================
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    // ===============API login page===================
    router.post('/api/login', userController.handleLogin);
    // ===============API React CRUD===================
    router.get('/api/get-all-user', userController.handleGetAllUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    // ================================================

    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctor', doctorController.getAllDoctor);
    router.post('/api/save-info-doctor', doctorController.postInfoDoctor);
    router.get(
        '/api/get-detail-doctor-by-id',
        doctorController.getDetailDoctorById
    );

    router.post(
        '/api/bulk-create-schedule',
        doctorController.bulkCreateSchedule
    );
    router.get(
        '/api/get-schedule-doctor-by-date',
        doctorController.getScheduleByDate
    );
    router.get(
        '/api/get-extra-infor-doctor-by-id',
        doctorController.getExtraInforDoctorById
    );
    router.get(
        '/api/get-profile-doctor-by-id',
        doctorController.getProfileDoctorById
    );

    router.post(
        '/api/patient-book-appointment',
        patientController.postBookAppointment
    );

    router.post(
        '/api/verify-book-appointment',
        patientController.postVerifyBookAppointment
    );

    router.post(
        '/api/create-new-specialty',
        specialtyController.createSpecialty
    );
    router.get('/api/get-all-specialty', specialtyController.getAllSpeicalty);
    router.get(
        '/api/get-detail-specialty-by-id',
        specialtyController.getDetailSpecialtyById
    );

    router.post('/api/create-new-clinic', clinicController.createClinic);
    // router.get('/api/get-all-specialty', specialtyController.getAllSpeicalty);
    // router.get(
    //     '/api/get-detail-specialty-by-id',
    //     specialtyController.getDetailSpecialtyById
    // );

    return app.use('/', router);
};

module.exports = initWebRoutes;
