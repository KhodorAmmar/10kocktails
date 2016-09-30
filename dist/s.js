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
        var spiritsArray = ['White Rum', 'Dry Vermouth', 'Tequila', 'Vodka', 'Gin', 'Cognac', 'Champagne', 'Cointreau', 'Bourbon', 'Calvados', 'Whiskey', 'Beer', 'Brandy', 'Jägermeister', 'Peach Schnapps', 'Limoncello', 'Scotch', 'Irish Whiskey', 'Orange bitters', 'Apricot Brandy', 'Irish Mist', 'Amaretto', 'Goldschläger'];
        spiritsArray = spiritsArray.sort(function(a, b) {
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        var html = [];
        for (var i = 0, len = spiritsArray.length; i < len; i++) {
            html.push(
                "<li><input type=\"checkbox\" name=\"spirit\" id=\"s" + i + "\"><label for=\"s" + i + "\">" + spiritsArray[i] + "</label></li>"
            );
        }
        spiritsElement.innerHTML = html.join('');
    }

    function generateIngredientLists() {
        var ingredientElement = getElementById('ilist');
        var ingredientsArray = ['Sugar Syrup', 'Lime Juice', 'Ice cubes', 'Sprite', 'Grapefruit Juice', 'Cherry', 'Lemon Juice', 'Club Soda', 'Honey', 'Ice', 'Tonic', 'Green Tea', 'Almond Milk', 'Cinnamon', 'Banana', 'Sugar Cube', 'Mint leaves', 'Cola', 'Irish Cream', 'Milk', 'Orange Juice', 'Pineapple Juice', 'Coconut Cream', 'Tabasco sauce', 'Basil', 'Sugar', 'Ice cream'];
        ingredientsArray = ingredientsArray.sort(function(a, b) {
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        var html = [];
        for (var i = 0, len = ingredientsArray.length; i < len; i++) {
            html.push(
                "<li><input type=\"checkbox\" name=\"ingredient\" id=\"i" + i + "\"><label for=\"i" + i + "\">" + ingredientsArray[i] + "</label></li>");
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

'use strict';

function callFetch(url, params, cb) {
    if (window.fetch) {
        window.fetch(url, params)
            .then(function(promise) {
                return promise.json();
            })
            .then(cb)
            .catch(function(error) {
                console.error(error);
            });
        return;
    } else {
        var createXHR = function() {
            var xhr;
            if (!window.XMLHttpRequest) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    xhr = null;
                }
            } else {
                xhr = new XMLHttpRequest();
            }

            return xhr;
        };
        var xhr = createXHR();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                cb(JSON.parse(xhr.responseText));
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }
}

function getElementById(id) {
    return document.getElementById(id);
}

function getElementsByTagName(tn) {
    return document.getElementsByTagName(tn);
}

function querySelector(q) {
    return document.querySelector(q);
}

function querySelectorAll(q) {
    return document.querySelectorAll(q);
}

function getElementsByName(n) {
    return document.getElementsByName(n);
}
'use strict';

(function() {

    var _iceCount = 5;
    var _bubbleCount = 40;

    function init() {

        var lcs = document.getElementsByClassName("lc");
        for (var k = 0; k < lcs.length; k++) {
            var lc = lcs[k];

            if (lc) {

                //Initialize ice
                var html = ['<div class=".container">'];
                for (var i = 0; i < _iceCount; i++) {
                    html.push(generateIce());
                }

                //Initialize bubbles
                for (var j = 0; j < _bubbleCount; j++) {
                    html.push(generateBubble());
                }

                html.push('</div>');

                lc.innerHTML = html.join('');
            }
        }

        //Initialize waves
        var waves = document.getElementsByClassName("wave");
        for (var k = 0; k < waves.length; k++) {
            waves[k].innerHTML = generateWave();
        }
    }

    function generateWave() {
        var scaleSpeed = getRandomNumber(5, 10) + 's';
        var traverseSpeed = getRandomNumber(10, 20) + 's';

        var scaleCss = {
            'animation-duration': scaleSpeed
        };
        var traverseCss = {
            'animation-duration': traverseSpeed
        };

        var waveHtml = [];
        waveHtml.push('<div class="container"><div class="wc" style="' + getCss(traverseCss) + '"><svg xmlns="http://www.w3.org/2000/svg" style="' + getCss(scaleCss) + '"  width="3275" height="150" class="waveSvg">')
        waveHtml.push('<path stroke="transparent" d="M0 200V80c40-70 65-70 95 0s55 70 85 0 60-70 95 0 55 70 95 0 50-70 95 0 45 70 95 0 40-70 95 0v120z" class="shape" transform="scale(4 1)"/></svg></div></div>');

        return waveHtml.join('');
    }

    function generateIce(top, left) {
        top = typeof top == 'undefined' ? getRandomNumber(20, 85) + '%' : top;
        left = typeof left == 'undefined' ? getRandomNumber(10, 90) + '%' : left;
        var bobSpeed = getRandomNumber(2, 4) + 's';
        var rotationSpeed = getRandomNumber(30, 50) + 's'; ///////////////////////////////////
        var rotationAnimation = 'ice-rotation' + (getRandomBoolean() ? '' : '-reverse');

        var iceCss = {
            'top': top,
            'left': left,
            'animation-duration': bobSpeed
        };

        var innerCss = {
            'animation-duration': rotationSpeed,
            'animation-name': rotationAnimation
        };

        var innerHtml = '<div class="inner" style="' + getCss(innerCss) + '">&nbsp;</div>'
        var iceHtml = '<div class="ice" style="' + getCss(iceCss) + '">' + innerHtml + '</div>';

        return iceHtml;
    }

    function generateBubble() {
        var left = getRandomNumber(0, 100);
        var bubbleSize = getRandomNumber(3, 10);
        var bubbleRadius = bubbleSize / 2;
        var opacity = getRandomNumber(0.1, 0.5);
        var bubbleSpeed = getRandomNumber(5, 20) + 's';
        var wiggleSpeed = getRandomNumber(1, 2) + 's';
        var wiggleAnimation = 'bubble-wiggle' + (getRandomBoolean() ? '' : '-reverse');

        var outerCss = {
            'animation-duration': bubbleSpeed
        };
        var bubbleCss = {
            'left': left + '%',
            'animation-duration': wiggleSpeed
        };

        var circleSvg = '<svg height="' + bubbleSize + '" width="' + bubbleSize + '" opacity="' + opacity + '"><circle cx="' + bubbleRadius + '" cy="' + bubbleRadius + '" r="' + bubbleRadius + '" fill="white" /></svg>';
        var outerHtml = '<div class="outer" style="' + getCss(outerCss) + '"><div class="inner">' + circleSvg + '</div></div>';
        var bubbleHtml = '<div class="bubble" style="' + getCss(bubbleCss) + '">' + outerHtml + '</div>';

        return bubbleHtml;
    }

    function getRandomNumber(min, max) {
        return min + (Math.random() * (max - min));
    }

    function getRandomBoolean() {
        return Math.random() > 0.5;
    }

    function getCss(css) {
        var style = '';
        for (var prop in css) {
            style += prop + ': ' + css[prop] + ';';
        }

        return style;
    }


    init();

})();
