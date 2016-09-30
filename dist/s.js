"use strict";function callFetch(e,t,n){if(window.fetch)return void window.fetch(e,t).then(function(e){return e.json()}).then(n).catch(function(e){console.error(e)});var r=function(){var e;if(window.XMLHttpRequest)e=new XMLHttpRequest;else try{e=new ActiveXObject("Microsoft.XMLHTTP")}catch(t){e=null}return e},i=r();i.onreadystatechange=function(){4===i.readyState&&n(JSON.parse(i.responseText))},i.open("GET",e,!0),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send(t)}function getElementById(e){return document.getElementById(e)}function getElementsByTagName(e){return document.getElementsByTagName(e)}function querySelector(e){return document.querySelector(e)}function querySelectorAll(e){return document.querySelectorAll(e)}function getElementsByName(e){return document.getElementsByName(e)}function capitalizeFirstLetter(e){return e=e.toLowerCase(),e.charAt(0).toUpperCase()+e.slice(1)}var tk={};!function(){function e(){var e=getElementById("slist"),t=["white rum","dry vermouth","tequila","vodka","gin","angostura","cognac","champagne","Cointreau","Bourbon","Calvados","Triple sec","lager","whiskey","Elderflower liqueur","beer","brandy","canadian whisky","blackcurrant liqueur","gold rum","dark rum","jägermeister","coconut rum","Sloe gin","peach schnapps","limoncello","Scotch","irish whiskey","peppermint schnapps","black raspberry liqueur","coffee liqueur","cherry liqueur","stout beer","Orange Bitters","apricot brandy","sweet vermouth","Irish Mist","Amaretto","Goldschläger"];t=t.sort(function(e,t){return e<t?-1:e>t?1:0});for(var n=[],r=0,i=t.length;r<i;r++)n.push('<li><input type="checkbox" name="spirit" id="s'+r+'"><label for="s'+r+'">'+capitalizeFirstLetter(t[r].toLowerCase())+"</label></li>");e.innerHTML=n.join("")}function t(){var e=getElementById("ilist"),t=["sugar syrup","lime juice","ice cubes","Sprite","grapefruit juice","cherry","lemon juice","club soda","honey","ice","tonic","green tea","almond milk","cinnamon","banana","sugar cube","mint leaves","cola","irish cream","Crème de Cacao","milk","orange juice","pineapple juice","coconut cream","tabasco sauce","White Crème de Cacao","chocolate syrup","basil","sugar","ice cream"];t=t.sort(function(e,t){return e<t?-1:e>t?1:0});for(var n=[],r=0,i=t.length;r<i;r++)n.push('<li><input type="checkbox" name="ingredient" id="i'+r+'"><label for="i'+r+'">'+capitalizeFirstLetter(t[r])+"</label></li>");e.innerHTML=n.join("")}var n=document.getElementsByTagName("body")[0],r=function(e){if(e&&e.cocktails&&!(e.cocktails.length<=0)){var t=e.cocktails[0];getElementById("cn").innerText=t.name;var r=getElementById("coi"),i=[];t.ingredients.forEach(function(e){i.push("<li><span>"+e.description+"</span></li>"),getElementById("gh").className+=e.description+" "}),r.innerHTML=i.join("");var a=getElementById("cos");i=[],t.steps.forEach(function(e){i.push("<li><span>"+e+"</span></li>")}),a.innerHTML=i.join(""),n.className="s6"}},i=function(){var e=function(e){var t="?";return e.forEach(function(e){"?"!==t&&(t+="&"),t+="ing="+e}),t},t=Array.prototype.slice.call(getElementsByName("ingredient"),0),n=Array.prototype.slice.call(getElementsByName("spirit"),0),i=[].concat(t,n),a=i.filter(function(e){return e.checked}).map(function(e){return querySelector("label[for="+e.id+"]").innerText});a&&a.length>0&&callFetch("/api/v1/cocktails"+e(a),a,r)},a=function(){callFetch("/api/v1/cocktails/random",[],r)};tk.startCounterToGetCocktails=function(e){var t=300,n=1,r=getElementById("counter"),c=function(){r.innerText=n,n++,n>10?e?a():i():setTimeout(c,t)};setTimeout(c,t)};var c=function(e,t){return e.className&&new RegExp("(\\s|^)"+t+"(\\s|$)").test(e.className)},o=function(e,t){e.className+=t},s=function(e,t){e.className=e.className.replace(t,"")};tk.filterSpiritsConcurrencyGuid=null,tk.filterSpirits=function(){var e=(new Date).toJSON();tk.filterSpiritsConcurrencyGuid=e;var t=getElementById("SpiritFilter").value,n=Array.prototype.slice.call(getElementsByName("spirit"),0);try{n.forEach(function(n){var r=tk.filterSpiritsConcurrencyGuid!==e;if(r)throw{};var i=n.id,a=n.parentElement,l=querySelector("label[for="+i+"]").innerText,u=!t||l.toUpperCase().indexOf(t.toUpperCase())>=0,d=u&&c(a,"hide")||n.checked,m=!u&&!c(a,"hide")&&!n.checked;d?s(a,"hide"):m&&o(a,"hide")},this)}catch(e){}},tk.filterIngredientsConcurrencyGuid=null,tk.filterIngredients=function(){var e=(new Date).toJSON();tk.filterIngredientsConcurrencyGuid=e;var t=getElementById("IngredientFilter").value,n=Array.prototype.slice.call(getElementsByName("ingredient"),0);try{n.forEach(function(n){var r=tk.filterIngredientsConcurrencyGuid!==e;if(r)throw{};var i=n.id,a=n.parentElement,l=querySelector("label[for="+i+"]").innerText,u=!t||l.toUpperCase().indexOf(t.toUpperCase())>=0,d=u&&c(a,"hide")||n.checked,m=!u&&!c(a,"hide")&&!n.checked;d?s(a,"hide"):m&&o(a,"hide")},this)}catch(e){}},tk.startOver=function(e){return n.className="s2",e&&Array.prototype.slice.call(getElementsByTagName("input"),0).filter(function(e){return e.checked}).map(function(e){e.checked=!1}),!1};var l=function(){var e=Array.prototype.slice.call(getElementsByName("ingredient"),0);e.forEach(function(e){e.addEventListener("change",function(){querySelector('input[name="ingredient"]:checked')?s(getElementById("btn-add-ingredients"),"disabled"):o(getElementById("btn-add-ingredients"),"disabled"),tk.filterIngredients()})});var t=Array.prototype.slice.call(getElementsByName("spirit"),0);t.forEach(function(e){e.addEventListener("change",function(){querySelector('input[name="spirit"]:checked')?s(getElementById("btn-add-spirits"),"disabled"):o(getElementById("btn-add-spirits"),"disabled")})})};document.addEventListener("DOMContentLoaded",function(r){for(var i=querySelectorAll(".next"),a=0,c=i.length;a<c;a++)i[a].addEventListener("click",function(e){e.preventDefault();var t=this.dataset.next;n.className="s"+t});e(),t(),l()})}(),function(){function e(){for(var e=document.getElementsByClassName("lc"),i=0;i<e.length;i++){var a=e[i];if(a){for(var c=['<div class=".container">'],l=0;l<o;l++)c.push(n());for(var u=0;u<s;u++)c.push(r());c.push("</div>"),a.innerHTML=c.join("")}}for(var d=document.getElementsByClassName("wave"),i=0;i<d.length;i++)d[i].innerHTML=t()}function t(){var e=i(5,10)+"s",t=i(10,20)+"s",n={"animation-duration":e},r={"animation-duration":t},a=[];return a.push('<div class="container"><div class="wc" style="'+c(r)+'"><svg xmlns="http://www.w3.org/2000/svg" style="'+c(n)+'"  width="3275" height="150" class="waveSvg">'),a.push('<path stroke="transparent" d="M0 200V80c40-70 65-70 95 0s55 70 85 0 60-70 95 0 55 70 95 0 50-70 95 0 45 70 95 0 40-70 95 0v120z" class="shape" transform="scale(4 1)"/></svg></div></div>'),a.join("")}function n(e,t){e="undefined"==typeof e?i(20,85)+"%":e,t="undefined"==typeof t?i(10,90)+"%":t;var n=i(2,4)+"s",r=i(30,50)+"s",o="ice-rotation"+(a()?"":"-reverse"),s={top:e,left:t,"animation-duration":n},l={"animation-duration":r,"animation-name":o},u='<div class="inner" style="'+c(l)+'">&nbsp;</div>',d='<div class="ice" style="'+c(s)+'">'+u+"</div>";return d}function r(){var e=i(0,100),t=i(3,10),n=t/2,r=i(.1,.5),o=i(5,20)+"s",s=i(1,2)+"s",l=("bubble-wiggle"+(a()?"":"-reverse"),{"animation-duration":o}),u={left:e+"%","animation-duration":s},d='<svg height="'+t+'" width="'+t+'" opacity="'+r+'"><circle cx="'+n+'" cy="'+n+'" r="'+n+'" fill="white" /></svg>',m='<div class="outer" style="'+c(l)+'"><div class="inner">'+d+"</div></div>",f='<div class="bubble" style="'+c(u)+'">'+m+"</div>";return f}function i(e,t){return e+Math.random()*(t-e)}function a(){return Math.random()>.5}function c(e){var t="";for(var n in e)t+=n+": "+e[n]+";";return t}var o=5,s=40;e()}();