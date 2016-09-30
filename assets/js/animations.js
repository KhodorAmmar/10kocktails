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
