const jwt = require('jsonwebtoken');
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
      data.profilePic = 'default.jpg';
      data.createdAt = Date.now();
      // console.log(data);
      // res.send(data);
      const userData = await userModel.create(data);
      const accessToken = jwt.sign({ id: userData._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d',  });
      res.cookie('_USID', accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 , sameSite: 'strict'})
      res.json(userData);
    } catch (error) {
      if (error?.keyPattern?.email === 1) {
        error.message = 'Email already exists';
        error.statusCode = 409;
      }
      next(error);
    }
  }
  else {
    const error = new Error('Input data is missing or invalid');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  }

};


module.exports = register;