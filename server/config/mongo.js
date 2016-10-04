'use strict';
var debug = require('debug')('api');

var mongoose = require('mongoose');

module.exports = function(app) {
    var connect = function() {
        var mongoLink = "";
            mongoLink = `mongodb://prototype_aka_part_readyonly:Dubai2020$@ds035776.mlab.com:35776/prototype_aka_part`;
        mongoose.connect(mongoLink, function(err, res) {
            if (err) {
                debug('Error connecting to: ' + mongoLink + '. ' + err);
            } else {
                debug('Connected to: ' + mongoLink);
            }
        });
    };
    connect();

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);
    mongoose.Promise = require('bluebird');
}
