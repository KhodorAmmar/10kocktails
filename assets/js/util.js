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

function capitalizeFirstLetter(str) {
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}
