// ==UserScript==
// @name         Título no Connectere
// @namespace    connectere
// @version      1.0
// @description  coloca título nas páginas do connectere. Primeira versão em 2026-11-18
// @author       You
// @match        *://*.connectere.agr.br/*
// @icon         https://maisgestao.connectere.agr.br/icon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var url = new URL(window.location.href)

    var caminho = url.pathname ;

    var subd = caminho.split('/');
    subd.shift();

    subd[0] = subd[0].replace(/[^A-Za-z]/g, ' ') ;
    let titulo = subd[0];

    if (url.searchParams.get("page") !== null){ // BUG: não está funcionando
        titulo += ' pagina ' + url.searchParams.get("page");
    }
    if (subd.length > 1){
        titulo = subd.join(' - ');
    }

    const capitalized = titulo.charAt(0).toUpperCase() + titulo.slice(1);
    if (capitalized !== "") {document.title = capitalized;}
})();