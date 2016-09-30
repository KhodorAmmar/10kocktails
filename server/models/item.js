'use strict';
var mongoose = require("mongoose");

var ItemSchema = new mongoose.Schema({
    name: String,
    steps: [String],
    ingredients: [{
        description: String,
        quantity: String,
        name: String,
        key: String
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('Item', ItemSchema);
