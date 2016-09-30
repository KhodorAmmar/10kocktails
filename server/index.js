'use strict';

var express = require('express');
var debug = require('debug')('api');
var app = new express();

var compression = require('compression');

//mongo
require('./config/mongo')(app);

// express configs
require('./config/express')(app);

// Routes
require('./routes')(app);

// start app
app.listen(process.env.PORT || 8080, (error) => {
    if (!error) {
        debug(`📡  Running on port: ${process.env.PORT || 8080}`);
    }
});
