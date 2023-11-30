import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayCRUD);
    router.get('/edit-crud', homeController.editCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    // ==================================
    router.post('/api/login', userController.handleLogin);
    // ===========================================

    router.get('/allcode', userController.getAllCode);

    return app.use('/', router);
};

module.exports = initWebRoutes;
