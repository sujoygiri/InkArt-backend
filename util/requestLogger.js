const fs = require('fs')
const path = require('path')


let isLogDirPresent = fs.existsSync(path.join(__dirname, '../logs'))
if (!isLogDirPresent) {
    fs.mkdirSync(path.join(__dirname, '../logs'))
}

const requestLogger = (req, res, next) => {
    const TODAY = new Date().toISOString().slice(0,10)
    const CURRENT_TIME = new Date().toLocaleTimeString()
    const logPath = path.join(__dirname, '../logs', `${TODAY}.log`)
    const log = `request method:- ${req.method} :: request url:- ${req.url} :: request ip:- ${req.ip} :: request date:- ${TODAY} :: request time:- ${CURRENT_TIME} \n`
    
    fs.appendFile(logPath, log, (err) => {
        if (err) {
            console.log(err, "logging of request failed")
        }
    })
    next()
}

module.exports = requestLogger