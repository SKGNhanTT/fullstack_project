import db from '../models/index';
import CRUDService from '../services/CRUDservice';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);

        return res.render('homepage.ejs', {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud');
};

let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        data,
    });
};

let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        if (userData) {
            res.render('edit-crud.ejs', {
                userData,
            });
        }
    } else {
        return res.send('view from edit page');
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        data: allUser,
    });
};

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDService.deleteUserById(userId);
        return res.send('delete success!');
    } else {
        return res.send('user not found!');
    }
};

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayCRUD,
    editCRUD,
    putCRUD,
    deleteCRUD,
};
