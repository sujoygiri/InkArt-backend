const { body } = require('express-validator');
const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');
const authRouter = require('express').Router();

const register = require('../controller/auth/register');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join('public','uploads','images'));
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      let fileName = crypto.randomBytes(10).toString('hex') + '.' + extension;
      cb(null, fileName);
    }
});

const upload = multer({ storage: storage });
// upload.single('profilePic'),

authRouter.post('/register',
    body('name').trim().notEmpty().escape().withMessage('Name is required').isLength({ min: 3, max: 50 }).withMessage('Name must be atleast 3 characters long and must not exceed 50 characters'),
    body('email').trim().notEmpty().escape().withMessage('Email is required').isEmail({ allow_ip_domain: false }).withMessage('Enter a valid email id'),
    body('password').trim().notEmpty().escape().withMessage('Password is required').isLength({ min: 8, max: 16 }).withMessage('Password must be atleast 8 characters long and must not exceed 50 characters').matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/).withMessage('Password must contain atleast one number, one lowercase, one uppercase letter and one special character'),
    register);

authRouter.post('/login', (req, res, next) => {
    res.send('Login page');
});

module.exports = authRouter;