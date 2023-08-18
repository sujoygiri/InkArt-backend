const userControllerObj = require('../controller/user/user.controller');

const userRoute = require('express').Router()

userRoute.get('/:username',userControllerObj.userProfileOverview)


module.exports = userRoute