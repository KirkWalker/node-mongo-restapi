const { format } = require('date-fns');
const { v4: uuid} = require('uuid');
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const logEvents = async (message,logName) => {
    const dateTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    //console.log(logItem);
    try {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs',logName), logItem);
    } catch (err) {
        console.error(err);
    }
}

const logger = (req, res, next) => {
    //console.log(`${req.method} ${req.path}`);
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    next();
}

module.exports = {logEvents, logger };

process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})