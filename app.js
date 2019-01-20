var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index'),
    customerRouter = require('./routes/customer'),
    productsRouter = require('./routes/products'),
    invoiceRouter = require('./routes/invoice');

//var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// Register routes
app.use('/', indexRouter);
app.use('/customer', customerRouter);
app.use('/products', productsRouter);
app.use('/invoice', invoiceRouter);

module.exports = app;
