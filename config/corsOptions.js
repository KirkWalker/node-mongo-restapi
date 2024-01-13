//Cross Origin Resource Sharing
const allowedOrigins = require('./allowedOrigins');
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin) { //remove this after development
            callback(null, true);
        } else {
            callback(new Error('Not allowed by cors'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;