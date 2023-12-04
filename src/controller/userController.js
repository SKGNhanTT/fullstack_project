import userService from '../services/userService';
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameters!',
        });
    }

    let userData = await userService.handleUserLogin(email, password);

    console.log(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

let handleGetAllUser = async (req, res) => {
    let id = req.query.id; // get all or id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required!!',
            user: [],
        });
    }

    let user = await userService.getAllUser(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        user,
    });
};

let handleCreateNewUser = async (req, res) => {
    console.log('data from req', req.body);
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    let allUser = await userService.updateUserData(data);
    return res.status(200).json(allUser);
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter!!',
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        }, 3000);
    } catch (e) {
        console.log('Get all code: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
};
