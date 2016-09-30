'use strict';
var tk = {};

(function() {

    var body = document.getElementsByTagName('body')[0];

    var fillCocktailData = function(data) {
        if (!data || !data.cocktails || data.cocktails.length <= 0) {
            return;
        }
        var cocktail = data.cocktails[0];

        getElementById("cn").innerText = cocktail.name;

        var cocktailIngredients = getElementById("coi");
        var html = [];
        cocktail.ingredients.forEach(function(ingredient) {
            html.push("<li><span>" + ingredient.description + "</span></li>");
            getElementById("gh").className += ingredient.description + " ";
        });
        cocktailIngredients.innerHTML = html.join('');

        var cocktailSteps = getElementById("cos");
        html = [];
        cocktail.steps.forEach(function(step) {
            html.push("<li><span>" + step + "</span></li>");
        });
        cocktailSteps.innerHTML = html.join('');

        body.className = 's6';
    }

    var getCocktails = function() {
        var parseIngredientsAsUrl = function(ingredients) {
            var url = "?";

            ingredients.forEach(function(ingredient) {
                if (url !== "?") url += "&";
                url += "ing=" + ingredient;
            });

            return url;
        };

        var allIngredients = Array.prototype.slice.call(getElementsByName("ingredient"), 0);
        var allSpirits = Array.prototype.slice.call(getElementsByName("spirit"), 0);
        var allElems = [].concat(allIngredients, allSpirits);
        var selIngredients = allElems.filter(function(item) {
            return item.checked;
        }).map(function(item) {
            return querySelector("label[for=" + item.id + "]").innerText;
        });

        if (selIngredients && selIngredients.length > 0) {
            callFetch(
                "/api/v1/cocktails" + parseIngredientsAsUrl(selIngredients),
                selIngredients,
                fillCocktailData);
        }
    }

    var getRandomCocktails = function() {
        callFetch(
            "/api/v1/cocktails/random", [],
            fillCocktailData);
    }

    tk.startCounterToGetCocktails = function(randomCocktail) {
        var counterDelay = 300;
        var counter = 1;
        var counterElem = getElementById("counter");

        var increaseCounter = function() {
            counterElem.innerText = counter;
            counter++;

            if (counter > 10) {
                if (randomCocktail) {
                    getRandomCocktails();
                } else {
                    getCocktails();
                }
            } else {
                setTimeout(increaseCounter, counterDelay);
            }
        };

        setTimeout(increaseCounter, counterDelay);
    };

    var hasClass = function(el, cls) {
        return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
    };
    var addClass = function(el, cls) {
        el.className += cls;
    };
    var removeClass = function(el, cls) {
        el.className = el.className.replace(cls, "");
    };

    tk.filterSpiritsConcurrencyGuid = null;

    tk.filterSpirits = function() {
        var myFilterGuid = new Date().toJSON();
        tk.filterSpiritsConcurrencyGuid = myFilterGuid;

        var filterText = getElementById("SpiritFilter").value;

        var allSpirits = Array.prototype.slice.call(getElementsByName("spirit"), 0);

        try {
            allSpirits.forEach(function(spirit) {
                var newFilterIsRunning = tk.filterSpiritsConcurrencyGuid !== myFilterGuid;
                if (newFilterIsRunning) throw {};

                var id = spirit.id;
                var listItem = spirit.parentElement;
                var labelText = querySelector("label[for=" + id + "]").innerText;

                var itMatches = !filterText || labelText.toUpperCase().indexOf(filterText.toUpperCase()) >= 0;
                var hiddenButShouldBeVisible = (itMatches && hasClass(listItem, "hide")) || spirit.checked;
                var visibleButShouldBeHidden = !itMatches && !hasClass(listItem, "hide") && !spirit.checked;

                if (hiddenButShouldBeVisible) {
                    removeClass(listItem, "hide");
                } else if (visibleButShouldBeHidden) {
                    addClass(listItem, "hide");
                }
            }, this);
        } catch (e) {

        }
    }

    tk.filterIngredientsConcurrencyGuid = null;

    tk.filterIngredients = function() {
        var myFilterGuid = new Date().toJSON();
        tk.filterIngredientsConcurrencyGuid = myFilterGuid;

        var filterText = getElementById("IngredientFilter").value;

        var allIngredients = Array.prototype.slice.call(getElementsByName("ingredient"), 0);

        try {
            allIngredients.forEach(function(ingredient) {
                var newFilterIsRunning = tk.filterIngredientsConcurrencyGuid !== myFilterGuid;
                if (newFilterIsRunning) throw {};

                var id = ingredient.id;
                var listItem = ingredient.parentElement;
                var labelText = querySelector("label[for=" + id + "]").innerText;

                var itMatches = !filterText || labelText.toUpperCase().indexOf(filterText.toUpperCase()) >= 0;
                var hiddenButShouldBeVisible = (itMatches && hasClass(listItem, "hide")) || ingredient.checked;
                var visibleButShouldBeHidden = !itMatches && !hasClass(listItem, "hide") && !ingredient.checked;

                if (hiddenButShouldBeVisible) {
                    removeClass(listItem, "hide");
                } else if (visibleButShouldBeHidden) {
                    addClass(listItem, "hide");
                }
            }, this);
        } catch (e) {

        }
    }

    tk.startOver = function(reset) {
        body.className = 's2';
        if (reset) {
            Array.prototype.slice.call(getElementsByTagName("input"), 0).filter(function(item) {
                return item.checked;
            }).map(function(item) {
                item.checked = false;
            });
        }
        return false;
    };

    function generateSpiritLists() {
        var spiritsElement = getElementById('slist');
        var spiritsArray = ['white rum', 'dry vermouth', 'tequila', 'vodka', 'gin', 'angostura', 'cognac', 'champagne', 'Cointreau', 'Bourbon', 'Calvados', 'Triple sec', 'lager', 'whiskey', 'Elderflower liqueur', 'beer', 'brandy', 'canadian whisky', 'blackcurrant liqueur', 'gold rum', 'dark rum', 'jägermeister', 'coconut rum', 'Sloe gin', 'peach schnapps', 'limoncello', 'Scotch', 'irish whiskey', 'peppermint schnapps', 'black raspberry liqueur', 'coffee liqueur', 'cherry liqueur', 'stout beer', 'Orange Bitters', 'apricot brandy', 'sweet vermouth', 'Irish Mist', 'Amaretto', 'Goldschläger'];
        spiritsArray = spiritsArray.sort(function(a, b) {
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        var html = [];
        for (var i = 0, len = spiritsArray.length; i < len; i++) {
            html.push(
                "<li><input type=\"checkbox\" name=\"spirit\" id=\"s" + i + "\"><label for=\"s" + i + "\">" + capitalizeFirstLetter(spiritsArray[i].toLowerCase()) + "</label></li>"
            );
        }
        spiritsElement.innerHTML = html.join('');
    }

    function generateIngredientLists() {
        var ingredientElement = getElementById('ilist');
        var ingredientsArray = ['sugar syrup', 'lime juice', 'ice cubes', 'Sprite', 'grapefruit juice', 'cherry', 'lemon juice', 'club soda', 'honey', 'ice', 'tonic', 'green tea', 'almond milk', 'cinnamon', 'banana', 'sugar cube', 'mint leaves', 'cola', 'irish cream', 'Crème de Cacao', 'milk', 'orange juice', 'pineapple juice', 'coconut cream', 'tabasco sauce', 'White Crème de Cacao', 'chocolate syrup', 'basil', 'sugar', 'ice cream'];
        ingredientsArray = ingredientsArray.sort(function(a, b) {
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        var html = [];
        for (var i = 0, len = ingredientsArray.length; i < len; i++) {
            html.push(
                "<li><input type=\"checkbox\" name=\"ingredient\" id=\"i" + i + "\"><label for=\"i" + i + "\">" + capitalizeFirstLetter(ingredientsArray[i]) + "</label></li>");
        }
        ingredientElement.innerHTML = html.join('');
    }

    var handleEvents = function() {
        var allIngredients = Array.prototype.slice.call(getElementsByName("ingredient"), 0);
        allIngredients.forEach(function(ingredient) {
            ingredient.addEventListener("change", function() {
                if (querySelector('input[name="ingredient"]:checked')) {
                    removeClass(getElementById("btn-add-ingredients"), "disabled");
                } else {
                    addClass(getElementById("btn-add-ingredients"), "disabled");
                }
                tk.filterIngredients();
            });
        });

        // Spirits: enable/disable add button
        var allSpirits = Array.prototype.slice.call(getElementsByName("spirit"), 0);
        allSpirits.forEach(function(spirit) {
            spirit.addEventListener("change", function() {
                if (querySelector('input[name="spirit"]:checked')) {
                    removeClass(getElementById("btn-add-spirits"), "disabled");
                } else {
                    addClass(getElementById("btn-add-spirits"), "disabled");
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        var elements = querySelectorAll('.next');
        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].addEventListener("click", function(event) {
                event.preventDefault();
                var number = this.dataset['next'];
                body.className = 's' + number;
            });
        }

        generateSpiritLists();
        generateIngredientLists();

        handleEvents();

    });

})();
