const { body } = require('express-validator');
const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');
const authRouter = require('express').Router();

const register = require('../controller/auth/register');
const login = require('../controller/auth/login');
const verifysession = require('../controller/auth/verifysession');
const authenticate = require('../controller/auth/authenticate');

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

const createNameChain = () => body('name').trim().notEmpty().escape().withMessage('Name is required').isLength({ min: 3, max: 50 }).withMessage('Name must be atleast 3 characters long and must not exceed 50 characters');

const createEmailChain = () => body('email').trim().notEmpty().escape().withMessage('Email is required').isEmail({ allow_ip_domain: false }).withMessage('Enter a valid email id');

const createPasswordChain = () => body('password').trim().notEmpty().escape().withMessage('Password is required').isLength({ min: 8, max: 16 }).withMessage('Password must be atleast 8 characters long and must not exceed 50 characters').matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/).withMessage('Password must contain atleast one number, one lowercase, one uppercase letter and one special character')

authRouter.post('/register',createNameChain(),createEmailChain(),createPasswordChain(),register);

authRouter.post('/login',createEmailChain(),createPasswordChain(),login);

authRouter.post('/authenticate', verifysession, authenticate);
// authRouter.post('/sessionverify', sessionverify, (req, res) => {
//   res.lo
// });

module.exports = authRouter;