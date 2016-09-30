'use strict';
var debug = require("debug")("api");
var Item = require('../models/item');
var matchFor = 1;
module.exports = function(app) {

    app.get('/api/v1/cocktails', getCocktails);
    app.get('/api/v1/cocktails/random', getRandomCocktail);

    function getCocktails(req, res) {
        var ing = req.query.ing || [];
        if (ing.constructor !== Array) {
            ing = [ing];
        }
        ing.forEach(toLowerCase);

        Item.find({}).exec(function(err, items) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err
                });
            }

            var filtered = items.filter(function(item) {
                var nbOfMatches = 0;
                item.ingredients.map(function(item) {
                    if (ing.indexOf(item.name.toLowerCase()) > -1) {
                        nbOfMatches++;
                    }
                });
                item.nbOfMatches = nbOfMatches;
                return nbOfMatches >= matchFor;
            });

            res.status(200).json({
                status: "success",
                cocktails: filtered.sort(function(a, b) {
                    return a.nbOfMatches > b.nbOfMatches;
                })
            });
        })
    };

    function getRandomCocktail(req, res) {
        Item.find({}).exec(function(err, items) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err
                });
            }

            var randomIndex = Math.floor(Math.random() * items.length);
            var randomCocktails = [items[randomIndex]];

            res.status(200).json({
                status: "success",
                cocktails: randomCocktails
            });
        });
    }

    function toLowerCase(string, i, collection) {
        return collection[i] = string.toLowerCase();
    }
}
