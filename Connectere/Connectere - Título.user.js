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
        const segmentos = url.pathname.split('/').filter(Boolean);

        // Verifica se existe algum segmento no caminho
        if (segmentos.length === 0) return;

        // Remove caracteres não alfabéticos do primeiro segmento
        segmentos[0] = segmentos[0].replace(/[^A-Za-z]/g, ' ');

        let titulo = segmentos.join(' - ');

        // Se estiver paginando, acrescenta o número da página
        if (url.searchParams.has('page')) {
            titulo += ' - pagina ' + url.searchParams.get('page');
        }

        // Capitaliza a primeira letra
        titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);

        document.title = titulo;
    }

    // Primeira execução
    atualizarTitulo();

    // Navegação pelo Turbo
    document.addEventListener('turbo:load', atualizarTitulo);

    // Navegação pelo histórico do navegador
    window.addEventListener('popstate', atualizarTitulo);

})();