const { body } = require('express-validator');
const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');
const authRouter = require('express').Router();

const register = require('../controller/auth/register.controller');
const login = require('../controller/auth/login.controller');
const verifysession = require('../controller/auth/verifysession.controller');
const authenticate = require('../controller/auth/authenticate.controller');
const logout = require('../controller/auth/logout.controller');

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

const nameValidationChain = () => body('name').trim().notEmpty().escape().withMessage('Name is required').isLength({ min: 3, max: 20 }).withMessage('Name must be atleast 3 characters long and must not exceed 20 characters').matches(/^[a-zA-Z0-9]+[\-]{0,1}[a-zA-Z0-9]+$/).withMessage('Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.');

const emailValidationChain = () => body('email').trim().notEmpty().escape().withMessage('Email is required').isEmail({ allow_ip_domain: false }).withMessage('Enter a valid email id');

const passwordValidationChain = () => body('password').trim().notEmpty().escape().withMessage('Password is required').matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,50}$/).withMessage('Password must be contain one uppercase, one lowercase, one number, one special charecter and 8 to 50 charecters long')

authRouter.post('/register',nameValidationChain(),emailValidationChain(),passwordValidationChain(),register);

authRouter.post('/login',emailValidationChain(),passwordValidationChain(),login);

authRouter.delete('/logout',logout);

authRouter.post('/authenticate', authenticate);

// authRouter.post('/sessionverify', sessionverify, (req, res) => {
//   req.session.regenerate
// });

module.exports = authRouter;