// ==UserScript==
// @name         Talos - automatizar diesel connectere
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatizar abastecimentos de diesel no connectere. Primeira versão em 2026-11-05
// @author       daniel
// @match        https://maisgestao.connectere.agr.br/maquinas/requisicoes
// @icon         https://maisgestao.connectere.agr.br/icon.png
// @grant        unsafeWindow
// ==/UserScript==

// TODO: validar json/csv
// TODO: simular envio
// TODO: adicionar informações ao histórico complementar - operador, serviço/operação/área, horímetro/odômetro (?)
// TODO: interface html

// ==========================================
// 1. CADASTRO DE MÁQUINAS
// ==========================================

const maquinas = {}; // pegar em private/maquinas.js ou em config/maquinas.example.js

// ==========================================
// 2. CONFIGURAÇÕES FIXAS
// ==========================================

const produtoId = ""; // copiar de private/diesel.js
const armazenamentoId = "";
const localizacaoId = "";
const unidade = "";

// ==========================================
// 3. PREPARAÇÃO DO FORMULÁRIO
// ==========================================

const form = document.querySelector("form");

if (!form) {
    throw new Error("Formulário não encontrado. Abra uma nova requisição.");
}

function montarFormulario(item) {
    const dados = new FormData(form);

    // Procura a máquina pelo código informado
    const codigoMaquina = String(item.maq).trim().toLowerCase();
    const maquina = maquinas[codigoMaquina];

    if (!maquina) {
        throw new Error(`Máquina não cadastrada: ${item.maq}`);
    }

    // Data
    dados.set("requisicao[data]", item.data);

    // ID da máquina
    dados.delete("equipamento_ids[]");
    dados.append("equipamento_ids[]", "");
    dados.append("equipamento_ids[]", maquina.id);

    // Produto
    dados.set(
        "requisicao[requisicao_produtos_attributes][0][produto_id]",
        produtoId
    );

    // Quantidade
    dados.set(
        "requisicao[requisicao_produtos_attributes][0][quantidade]",
        String(item.quantidade)
    );

    // Unidade
    dados.set("um", unidade);

    // Armazenamento
    dados.set(
        "requisicao[requisicao_produtos_attributes][0][local_armazenamento_id]",
        armazenamentoId
    );

    // Localização
    dados.set(
        "requisicao[requisicao_produtos_attributes][0][localizacao_id]",
        localizacaoId
    );

    // Ignorar reserva
    dados.set(
        "requisicao[requisicao_produtos_attributes][0][ignorar_reserva]",
        "1"
    );

    // Histórico complementar / observação
    dados.set(
        "requisicao[historico_complementar]",
        `TQV - ${maquina.obs} - ${item.quantidade} L`
    );

    return dados;
}

// ==========================================
// 4. ENVIO DE UMA REQUISIÇÃO
// ==========================================

async function enviarUm(item) {
    const codigoMaquina = item.maq.trim().toLowerCase();
    const maquina = maquinas[codigoMaquina];

    if (!maquina) {
        throw new Error(`Máquina não cadastrada: ${item.maq}`);
    }

    const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content;

    if (!csrfToken) {
        throw new Error("Token CSRF não encontrado.");
    }

    const response = await fetch(form.action, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "X-CSRF-Token": csrfToken,
            "Accept": "text/vnd.turbo-stream.html, text/html, application/xhtml+xml"
        },
        body: montarFormulario(item),
        redirect: "follow"
    });

    const body = await response.text();

    const doc = new DOMParser().parseFromString(body, "text/html");

    const mensagens = [
        ...doc.querySelectorAll(
            ".alert, [role='alert'], .flash, .notice, .error"
        )
    ]
    .map(elemento => elemento.textContent.trim())
    .filter(Boolean);

    const resultado = {
        data: item.data,
        codigo: item.maq,
        maquina: maquina.obs,
        id: maquina.id,
        quantidade: item.quantidade,
        observacao: `${maquina.obs} - ${item.quantidade} L`,
        status: response.status,
        ok: response.ok,
        redirecionado: response.redirected,
        urlFinal: response.url,
        contentType: response.headers.get("content-type"),
        mensagens
    };

    console.table(resultado);

    return resultado;
}

// ==========================================
// 2. ABASTECIMENTOS PARA EDITAR - json
// ==========================================
// gerar csv: https://www.tablesgenerator.com/csv_tables
// converter para json: https://csvjson.com/

const abastecimentosJson = [ // alterar para lançamentos
    {
        "data": "01/01/0001",
        "maq": "000",
        "quantidade": 6969
    }
];

// CSV - valores não podem ter vírgula

const csv = `data,maq,quantidade
01/01/0001,000,6969`; // alterar para lançamentos

const linhas = csv.trim().split(/\r?\n/);
const colunas = linhas[0].split(",");

const abastecimentosCsv = linhas.slice(1).map(linha => {
  const valores = linha.split(",");
  return Object.fromEntries(
    colunas.map((coluna, i) => [coluna, valores[i]])
  );
});

unsafeWindow.json = abastecimentosJson;
unsafeWindow.csv = abastecimentosCsv;
unsafeWindow.enviarUm = enviarUm;

let mensagem = "funções de automatizar lançamento carregadas\n";
mensagem += "mais informações em 'ajuda'\n";

let ajuda = "abra o script e edite os dados, e utilize enviarUm()\n";
ajuda += "formato dos dados aceito em enviarUm(item):\n\n";
ajuda += '\titem = { "data": "23/11/2026",\n';
ajuda += '\t\t"maq": "000",\n';
ajuda += '\t\t"quantidade": 12.34\n';
ajuda += '\t};\n\n';

unsafeWindow.ajuda = ajuda;

console.log(mensagem);

