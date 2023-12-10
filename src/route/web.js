import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';

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

    return app.use('/', router);
};

module.exports = initWebRoutes;
