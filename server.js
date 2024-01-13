require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors');
const {logEvents, logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');

//Connect to mongo db
connectDB();

app.use(logger);

app.use(errorHandler);

//Handle options credentials check - before CORS
//and fetch cookies credential requirement
app.use(credentials);

//Cross origin resource sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

//authenticated routes
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: "404 not found"});
    } else {
        res.type('txt').send("404 not found")
    }
});


//console.log("process.env.NODE_ENV",process.env.NODE_ENV);
mongoose.connection.once('open', () => {
    if (!process.env.NODE_ENV === 'test' || !process.env.NODE_ENV) {
        console.log("connected to mongo DB");
        app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });
    }
})
module.exports = app