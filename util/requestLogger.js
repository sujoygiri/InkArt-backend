const fs = require('fs')
const path = require('path')

let isLogDirPresent = fs.existsSync(path.join(__dirname, '../logs'))
if (!isLogDirPresent) {
    fs.mkdirSync(path.join(__dirname, '../logs'))
}
const logPath = path.join(__dirname, '../logs', 'requests.log')

const requestLogger = (req, res, next) => {
    const log = `request method:- ${req.method} :: request url:- ${req.url} :: request ip:- ${req.ip} :: request time:- ${new Date().toISOString()} \n`
    
    fs.appendFile(logPath, log, (err) => {
        if (err) {
            console.log(err, "logging of request failed")
        }
    })
    next()
}

module.exports = requestLogger