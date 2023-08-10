const express = require('express')

const articaleControllerObj = require('../controller/articale/articale.controller')

const articaleRoute = express.Router()

articaleRoute.get('/get-articale',articaleControllerObj.getarticale)

module.exports = articaleRoute
