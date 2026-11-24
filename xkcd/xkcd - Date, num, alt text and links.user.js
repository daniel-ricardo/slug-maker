// ==UserScript==
// @name          xkcd Date, num, alt text and links
// @include        http*://store.xkcd.com/collections/everything/products/signed-prints
// @version       1.0
// @description   Adds the date the comic was published, and puts the number on the title, puts the xkcd tooltip under the picture and adds a link to explainxkcd.com. It does the same work with what-if tooltips. Finally, it adds links to the printed comics sold in the store.
// @icon          http://i.imgur.com/tedLgiQ.png
// @icon64        http://i.imgur.com/JKCTQ6F.png
// @match       /^https?:\/\/(www\.)?xkcd\.com\/(\d*\/)?$/
// @include        http*://xkcd.com/*
// @include        http*://www.xkcd.com/*
// @include        http*://what-if.xkcd.com/*
// @include        http*://www.what-if.xkcd.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/3762/xkcd%20Title%20and%20Explain.user.js
// @updateURL https://update.greasyfork.org/scripts/3762/xkcd%20Title%20and%20Explain.meta.js
// @downloadURL https://update.greasyfork.org/scripts/3188/XKCD%20tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/3188/XKCD%20tooltip.meta.js
// ==/UserScript==

function getMeta() {
    /* pega os dados do quadrinho */
	var jsonResponse;
	var xkcdMeta = new XMLHttpRequest();
	function reqListener () {
		jsonResponse = this.responseText;
	}
	xkcdMeta.onload = reqListener;
	xkcdMeta.open("get", document.URL + "info.0.json", false);
	xkcdMeta.send();
	return jsonResponse;
}

function setExplainBtn(){
    /* Cria um botão com link para explainxkcd e coloca ao lado dos outros */
    var uls = document.getElementById('middleContainer').getElementsByTagName("ul");
    var id = document.getElementById('middleContainer').getElementsByTagName("ul")[0].getElementsByTagName("li")[1].getElementsByTagName("a")[0].href;
    id = parseInt(id.split("xkcd.com")[1].split("/")[1]) + 1;
    uls[0].appendChild(exLink(id));
    uls[1].appendChild(exLink(id));
}

function exLink(id) {
    /* Cria o elemento do botão com link para xkcd */
	var li = document.createElement("li");
	var link = document.createElement('a');
	link.setAttribute('href', 'http://www.explainxkcd.com/wiki/index.php/' + id);
	link.appendChild(document.createTextNode("Explanation"));
	link.setAttribute('title', 'Explanation on explainxkcd.com');
	li.appendChild(link);
	return li;
}

function setDate() {
    /* coloca a data em uma faixa abaixo da imagem */
    var dDiv = document.createElement('div');
    dDiv.setAttribute('align', 'center');
    dDiv.style.fontSize='15px';
    dDiv.style.fontVariant='normal';
    dDiv.style.margin = "10px 0 0 0";
    dDiv.style.padding = "3px 0 3px 0";
    dDiv.style.backgroundColor = "#EEEEEE";
    var tSpan = document.createElement("span");
    var jsonObj = JSON.parse(getMeta());
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    tSpan.appendChild(document.createTextNode(/*"Date: " +*/ months[jsonObj.month - 1] + " " + jsonObj.day + ", " + jsonObj.year));
    tSpan.style.color = "#999999";
    dDiv.appendChild(tSpan);
    document.getElementById('comic').appendChild(dDiv);
}

function setTitle() {
  /* coloca o número do xkcd no título */
  var meta = JSON.parse(getMeta());
  document.getElementById("ctitle").textContent =
    meta.num + ": " + meta.safe_title;
}

function setAltText(){
    /* coloca o alt text em uma caixa abaixo da imagem e da data */
    var css = [];
    var i = 0;
    css[i++] = ".tooltip { ";
    css[i++] = "    padding: 5px; ";
    css[i++] = "    margin: 15px auto 20px; ";
    css[i++] = "    font-size: 80%; ";
    css[i++] = "    width: 60%; ";
    css[i++] = "    border-style: solid; ";
    css[i++] = "    border-radius: 12px; ";
    css[i++] = "}";
    css[i++] = ".xkcdtooltip {";
    css[i++] = "    border-width: 1px; ";
    css[i++] = "}";
    css[i++] = ".whatiftooltip { ";
    css[i++] = "    border: 1px solid #005994; ";
    css[i++] = "    padding: 1.5ex; ";
    css[i++] = "    margin-top: 0; ";
    css[i++] = "}";

    var addAfter = function (dom, newNode){
        dom.parentNode.insertBefore(newNode, dom.nextSibling);
    }

    var addTitleBox = function(img, after, cssClass) {
        var title = img.title;
        if(title.length == 0){
            return null;
        }
        //img.title='';

        var titleBox = document.createElement('div');
        titleBox.textContent = title;
        titleBox.classList.add('tooltip');
        titleBox.classList.add(cssClass);

        addAfter(after,titleBox);
        return titleBox;
    }

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.join('\n');
    document.head.appendChild(style);

    var comicBox = document.getElementById('comic');

    if (comicBox) {
        var img = comicBox.querySelector('*[title]');
        if (img) {
            addTitleBox(img, comicBox, 'xkcdtooltip');
        }

        var id = document.location.href.split('/')[3];
        var navs = document.getElementsByClassName('comicNav');
        for (i = 0 ; i < navs.length ; i++ ) {
            var a = document.createElement('a');
            a.href = 'http://www.explainxkcd.com/wiki/index.php?title=' + id;
            a.textContent = 'Explain';
            var li = document.createElement('li');
            li.appendChild(a);
            addAfter(navs[i].children [2], li);
        }
    }

    var article = document.getElementsByTagName('article');
    if(article.length > 0){
        var imgs = article[0].getElementsByTagName('img');
        for (i =0 ; i<imgs.length ; i++){
            addTitleBox(imgs[i], imgs[i], 'whatiftooltip');
        }
    }
}

setTitle();
setDate();
setAltText();
