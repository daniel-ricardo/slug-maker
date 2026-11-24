// ==UserScript==
// @name         Connectere - Preencher padrões no abastecimento de diesel
// @namespace    connectere
// @version      1.0
// @description  Preenche produto, armazenamento e localização. Primeira versão em 2026-11-08
// @match        https://maisgestao.connectere.agr.br/maquinas/requisicoes/new*
// @include      https://maisgestao.connectere.agr.br/estoque/requisicoes/new*
// @icon         https://maisgestao.connectere.agr.br/icon.png
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const prefixo = 'requisicao_requisicao_produtos_attributes_0_';

    const diesel = { // pegar as informações em private/diesel.js
        produto: {
            nome: '',
            id: ''
        },
        armazenamento: {
            id: ''
        },
        localizacao: {
            id: ''
        }
    };

    const campoData = document.getElementById('requisicao_data');

    if (!campoData) return;

    // Aguarda e seleciona uma opção do Tom Select
    async function selecionarOpcao(campo, valor, timeout = 3000) {
        const inicio = Date.now();
        const input = document.getElementById(campo + '-ts-control');

        input.focus();
        input.click();

        let ultimaMudanca = Date.now();
        let conteudoAnterior = '';

        while (Date.now() - inicio < timeout) {
            const dropdown = document.getElementById(campo + '-ts-dropdown');
            const conteudo = dropdown?.innerHTML || '';

            if (conteudo !== conteudoAnterior) {
                conteudoAnterior = conteudo;
                ultimaMudanca = Date.now();
            }

            const opcao = document.querySelector(
                `#${campo}-ts-dropdown [data-value="${valor}"]`
            );

            if (opcao && Date.now() - ultimaMudanca >= 1000) {
                opcao.click();

                await new Promise(resolve => setTimeout(resolve, 700));

                const selecionada = document.querySelector(
                    `#${campo}-ts-dropdown [data-value="${valor}"][aria-selected="true"]`
                );

                if (selecionada) {
                    console.log(`Selecionado: ${valor} em ${campo}`);
                    return true;
                }

                ultimaMudanca = Date.now();
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        throw new Error(`Não foi possível selecionar ${valor} em ${campo}`);
    }

    // Pesquisa o produto
    async function pesquisarProduto(nome) {
        const campo = prefixo + 'produto_id';
        const input = document.getElementById(campo + '-ts-control');

        input.focus();
        input.value = nome;

        input.dispatchEvent(new Event('input', {
            bubbles: true
        }));

        return campo;
    }

    // Preenchimento principal
    async function preencherPadrao() {
        const produto = await pesquisarProduto(diesel.produto.nome);

        await selecionarOpcao(produto, diesel.produto.id);

        await selecionarOpcao(
            prefixo + 'local_armazenamento_id',
            diesel.armazenamento.id
        );

        await selecionarOpcao(
            prefixo + 'localizacao_id',
            diesel.localizacao.id
        );
    }

    // Cria botão
    const botao = document.createElement('button');

    botao.textContent = 'Preencher padrões';
    botao.type = 'button';

    Object.assign(botao.style, {
        position: 'fixed',
        right: '25px',
        bottom: '25px',
        zIndex: '99999',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        background: '#2563eb',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        opacity: '0.5'
    });

    function atualizarBotao() {
        const preenchida = campoData.value.trim() !== '';

        botao.disabled = !preenchida;
        botao.style.opacity = preenchida ? '1' : '0.5';
        botao.style.cursor = preenchida ? 'pointer' : 'not-allowed';
    }

    campoData.addEventListener('change', atualizarBotao);
    campoData.addEventListener('input', atualizarBotao);

    botao.addEventListener('click', async () => {
        botao.disabled = true;
        botao.textContent = 'Preenchendo...';

        try {
            await preencherPadrao();
            botao.textContent = 'Preenchido!';
        } catch (erro) {
            console.error(erro);
            botao.textContent = 'Erro ao preencher';
        } finally {
            setTimeout(() => {
                botao.textContent = 'Preencher padrões';
                atualizarBotao();
            }, 2000);
        }
    });

    document.body.appendChild(botao);
    atualizarBotao();

})();
