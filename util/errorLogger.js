const fs = require('node:fs')
const path = require('node:path')

const TODAY = new Date().toISOString().slice(0,10)
const CURRENT_TIME = new Date().toLocaleTimeString()

let isLogDirPresent = fs.existsSync(path.join(__dirname, '../logs'))
if (!isLogDirPresent) {
    fs.mkdirSync(path.join(__dirname, '../logs'))
}
const logPath = path.join(__dirname, '../logs', 'errors.log')

const errorLogger = (err, req, res, next) => {
    if (err) {
        fs.appendFile(logPath, `Date:- ${TODAY} :: Time:- ${CURRENT_TIME}` + " :: " + err.stack + "\n", (error) => {
            if (error) {
                console.log("logging of error failed");
            }
        });
        if (err.status) {
            res.status(err.status);
        }
        else {
            res.status(500);
        }
        res.json({ "message": err.message });
    }
    next();
}

module.exports = errorLogger;