const fs = require('fs')
const path = require('path')

const TODAY = new Date().toISOString().slice(0,10)
const CURRENT_TIME = new Date().toLocaleTimeString()

let isLogDirPresent = fs.existsSync(path.join(__dirname, '../logs'))
if (!isLogDirPresent) {
    fs.mkdirSync(path.join(__dirname, '../logs'))
}
const logPath = path.join(__dirname, '../logs', `${TODAY}.log`)

const requestLogger = (req, res, next) => {
    const log = `request method:- ${req.method} :: request url:- ${req.url} :: request ip:- ${req.ip} :: request date:- ${TODAY} :: request time:- ${CURRENT_TIME} \n`
    
    fs.appendFile(logPath, log, (err) => {
        if (err) {
            console.log(err, "logging of request failed")
        }
    })
    next()
}

module.exports = requestLogger