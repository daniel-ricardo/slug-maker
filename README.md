# slug-maker

## Connectere

Scripts para facilitar e automatizar o trabalho de lançamentos no connectere.

### Título

Por padrão, as páginas do sistema são geradas todas com o mesmo título: "+Gestão - Connectere". Isso dificulta a organização do trabalho com mais de uma guia aberta, e também a navegação pelo histórico de páginas do navegador. Esse script gera títulos de acordo com o caminho da url.

### Automatizar diesel

O lançamento manual de abastecimentos de diesel é bastante repetitivo, e várias informações se repetem - quando faço o lançamento em uma fazenda, o produto, local de armazenamento e localização que estou pegando são sempre os mesmos. Com frequência, esses lançamentos se acumulam em dezenas de cada vez. Ainda se dificulta mais pelo fato que o formulário é montado de forma assíncrona e com campos dependentes de outros - o produto precisa ser pesquisado no estoque, e apenas depois que a data é preenchida e a localização só é pesquisada e carregada depois que o local de armazenamento e o produto são selecionados.

Com esse script, eu monto uma tabela csv apenas com as colunas que tem informações relevantes (data, máquina e quantidade), e o formulário é montado com todas as outras que se repetem, sem precisar esperar os resultados de pesquisas assíncronas, já que os ids já são conhecidos.

### Preencher padrões no abastecimento de diesel

Uma automação alternativa do lançamento de abastecimentos. Ao carregar a página de lançamentos individuais, depois de preencher a data, um botão se torna disponível para preencher as informações padronizadas - produto, local de armazenamento e localização. Esse preenchimento ainda tem que aguardar o resultado das pesquisas assíncronas.

## xkcd

Um script que adiciona informações nas páginas de tirinhas xkcd. Minha versão é uma mistura de outros scripts já existentes anteriormente.
Doodles - http://greasyfork.org/users/2240-doodles - https://update.greasyfork.org/scripts/3762/xkcd%20Title%20and%20Explain.user.js
Sem autor atribuído - https://update.greasyfork.org/scripts/3188/XKCD%20tooltip.user.js