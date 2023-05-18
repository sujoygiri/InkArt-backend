const bcrypt = require('bcryptjs');
const { validationResult, matchedData } = require('express-validator');

const userModel = require('../../models/users.model');

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const data = matchedData(req);
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(data.password, salt);
      data.password = hashedPassword;
      data.role = 'user';
      data.profilePic = 'user.png';
      data.createdAt = Date.now();
      const userData = await userModel.create(data);
      if (userData) {
        let userId = userData._id.toString();
        req.session.regenerate((err) => {
          if (err) {
            let error = new Error('Registration failed!');
            error.status = 500;
            return next(error);
          }
          req.session.userId = userId;
          req.session.save((err) => {
            if (err) {
              let error = new Error('Registration failed!');
              error.status = 500;
              return next(error);
            }
            res.status(201).json({status:'success', message: 'User registered successfully', userName: userData.name });
            next();
          });
        });
      }else{
        let error = new Error('Registration failed!');
        error.status = 500;
        return next(error);
      }
    } catch (error) {
      if (error?.keyPattern?.email === 1) {
        error.message = 'Email already exists';
        error.status = 409;
      }
      next(error);
    }
  }
  else {
    const error = new Error('Input data is missing or invalid');
    error.status = 422;
    error.data = errors.array();
    next(error);
  }

};


module.exports = register;