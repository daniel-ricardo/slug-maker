// ==UserScript==
// @name         Título no Connectere
// @namespace    connectere
// @version      1.1
// @description  Coloca título nas páginas do Connectere
// @author       You
// @match        *://*.connectere.agr.br/*
// @icon         https://maisgestao.connectere.agr.br/icon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function atualizarTitulo() {
        const url = new URL(window.location.href);

        const subd = url.pathname.split('/').filter(Boolean);

        if (subd.length === 0) return;

        subd[0] = subd[0].replace(/[^A-Za-z]/g, ' ');

        let titulo = subd.join(' - ');

        if (url.searchParams.has('page')) {
            titulo += ' - pagina ' + url.searchParams.get('page');
        }

        titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);

        if (titulo !== '') {
            document.title = titulo;
        }
    }

    // Primeira execução
    atualizarTitulo();

    // Navegação pelo Turbo
    document.addEventListener('turbo:load', atualizarTitulo);

    // Navegação pelo histórico do navegador
    window.addEventListener('popstate', atualizarTitulo);

})();