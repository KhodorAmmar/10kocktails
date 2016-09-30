'use strict';
var debug = require('debug')('api');

var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');
var bodyParser = require('body-parser');

module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(compression());
    app.disable('x-powered-by');

    app.use(serveStatic('dist', {
        'index': ['index.html'],
        'dotfiles': 'ignore',
        'maxAge': '7d',
        'setHeaders': setCustomCacheControl
    }));

    debug('--------------------------');
    debug('☕️ ');
    debug('Starting Server');
    debug('Environment: ' + process.env.NODE_ENV);

    function setCustomCacheControl(res, path) {
        if (serveStatic.mime.lookup(path) === 'text/html') {
            res.setHeader('Cache-Control', 'public, max-age=0')
        }
    }
}
