const bcrypt = require('bcryptjs');
const { validationResult, matchedData } = require('express-validator');

const userModel = require('../../models/users.model');

const login = async (req, res, next) => {
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let data = matchedData(req, { onlyValidData: true });
            let userMailId = data.email;
            let userData = await userModel.findOne({ email: userMailId });
            if (!userData) {
                let error = new Error('User did not found!');
                error.status = 404;
                return next(error);
            }
            let isPasswordMatched = bcrypt.compareSync(data.password, userData.password);
            if (!isPasswordMatched) {
                let error = new Error('Password did not match!');
                error.status = 400;
                return next(error);
            }
            let userId = userData._id.toString();
            let userProfilePic = userData.profilePic
            req.session.regenerate((err) => {
                if (err) {
                    let error = new Error('Login failed!');
                    error.status = 500;
                    return next(error);
                }
                req.session.userId = userId;
                req.session.userName = userData.username
                req.session.save((err) => {
                    if (err) {
                        let error = new Error('Login failed!');
                        error.status = 500;
                        return next(error);
                    }
                    res.status(201).json({status:'success', message: 'Login successfull', userName: userData.username, profile_pic:userProfilePic });
                    next();
                });
            });
        } catch (error) {
            next(error);
        }
    } else {
        const error = new Error('Invalid credentials');
        error.status = 422;
        error.data = errors.array();
        next(error);
    }

};


module.exports = login;