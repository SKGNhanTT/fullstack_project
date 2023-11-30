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

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get all code: ', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};

module.exports = { handleLogin, getAllCode };
