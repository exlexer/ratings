const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

const router = require('./api/router');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('client/dist'));
app.use('/api', router);

app.use((err, req, res, next) => {
    console.log(err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.send(err);
});

module.exports = app;
