# FeiraBus

![Logo](https://raw.githubusercontent.com/jefersonjhone/feirabus/main/public/logo_feirabus.png)

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://feirabus.vercel.app)
[![GitHub Issues](https://img.shields.io/github/issues/Jefersonjhone/feirabus.svg)](https://github.com/Jefersonjhone/feirabus/issues)

## 🚌 FeiraBus - Frontend

Este é o frontend de um sistema de visualização de linhas de ônibus. A aplicação consome uma API REST para exibir informações como rotas, horários e pontos de parada de forma clara e acessível aos usuários.

## 🌐 Sobre o projeto

O objetivo deste sistema é oferecer uma interface amigável e responsiva para que os passageiros possam consultar as linhas de ônibus disponíveis, seus itinerários, possíveis rotas e horários atualizados. Ele serve como uma ponte entre os dados fornecidos pela API e o usuário final, apresentando tudo de maneira organizada e fácil de navegar.

## 🔍 Funcionalidades

- Listagem de todas as linhas disponíveis

- Visualização detalhada de cada linha (nome, número, itinerário)

- Exibição de horários e pontos de parada

- Comparar itinerários

- Calcular rotas possíveis

- Interface responsiva e acessível

## ⚙️ Tecnologias utilizadas

- React

- React Router para navegação

- Tailwind CSS para estilização

- React-Leaflet para mapas

- Leaflet-ant-path para exibir as rotas

## ⚙️ desafios técnicos

Desde a idealização do projeto surgiram alguns desafios e limitações técnicas, logo abaixo estão alguns desses desafios e a abordagem utilizada pra solucioná-los:

### 1. Consumo e tratamento de dados da API

#### 🔒 1. JSONP E CORS

##### Problema:

Ao listar os endpoints da API, notei que o padrão usado era JSONP [(JSON with padding)](https://www.w3schools.com/js/js_json_jsonp.asp), o que dificulta o uso de `fetch` e `XMLHttpRequest`, devido a política de CORS [(Cross-Origin Resource Sharing)](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/CORS), além disso, a API usa `HTTP` ao invés de `HTTPS`, fragilizando ainda mais a segurança e impossibilitando as requisições dado que meu app rodaria em `HTTPS` e a política de `CORS` só permite requisições de protocolos iguais, além da politica de segurança [mixed content blocking](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content) não permitir esse tipo de requisição.

##### possíveis abordagens

- ~~Rodar meu app usando `http`~~ (inviável)

- Se comunicar usando JSONP, usando tags de `<script>` e passando as funções de `setState` como callback, abdicando da segurança.

- Subir um servidor como proxy para fazer as requisições à API e retornar um `JSON` via `HTTPS`, possibilitando configurar a política de CORS, Cache, Autenticação e outros recursos que a API não disponibiliza.

- Rodar o app usando NextJS, e fazer as requisições no `server` ao invés de rodar no `client`.

##### Abordagem usada

Devido à grande importância da **segurança**, à **confiabilidade dos dados** e à necessidade de **implementar alguns recursos ausentes na API original**, eu optei por usar um servidor `proxy`.

#### 📐 2. Estrutura de dados inadequada para exibição direta

##### Problema:

Tomemos como exemplo 4 endpoints da API original:
`/buscarDadosParada/{parada}/{usuario}/{callback}`
`/buscarPrevisoes/{parada}/{usuario}/{callback}`
`/retornaLinhasQueAtendemParada/{codParada}/{usuario}/{callback}`
`/buscarParadasProximas/{latitude}/{longitude}/{usuario}/{callback}`

Nota-se que, apesar de possuir recursos semelhantes, os endpoints estão despadronizados e necessitam de um campo de `usuario` que só precisa ser um `número inteiro` e um campo de `calback` que é para uso do `jsonp` podendo sem qualquer `texto`.

`/paradas/{id}`\
`/paradas/{id}/previsoes`\
`/paradas/{id}/linhas-que-atendem`\
`/paradas/paradas-proximas/@{lat},{long}`

A API original expõe os dados de maneira genérica e, muitas vezes, não relacionada diretamente aos fluxos de uso da interface. Por exemplo:

Não há um endpoint para retornar os dados completos de uma linha a partir de seu ID

Paradas e itinerários exigem múltiplas chamadas encadeadas

Campos relevantes estão ausentes ou com nomes pouco descritivos

##### Solução:

No proxy, foram criadas rotas específicas e orientadas ao frontend, como:

`/api/linhas/<id>`: retorna detalhes de uma linha

`/api/linhas/<id>/itinerarios`: associa a linha diretamente aos seus itinerários

`/api/paradas/<id>`: normaliza os dados de localização e nome

Essas rotas reorganizam os dados da API original para facilitar o consumo e a renderização no frontend com mínima transformação adicional no cliente.

#### 🧭 3. Navegação entre entidades relacionadas

##### Problema:

Na estrutura original, não há relacionamentos explícitos entre os recursos. Por exemplo, um item do tipo "itinerario" não possui uma chave direta que referencie uma "linha", o que dificulta:

Criar rotas dinâmicas por ID

Renderizar informações encadeadas

Exibir contextos completos de forma consistente

##### Solução:

O proxy atua como orquestrador da relação entre os dados, mapeando e inferindo os vínculos entre linhas, paradas e itinerários, e os expondo por meio de rotas que refletem essa estrutura hierárquica. Com isso, a navegação no frontend pôde ser construída com base em URLs significativas e dados resolvidos previamente.

#### ⚠️ 4. Tratamento inconsistente de erros e respostas nulas

###### Problema:

A API original retorna respostas genéricas mesmo em situações de erro (ex: 200 OK com corpo null ou listas vazias), dificultando o controle de fluxo no frontend.

Solução:

O proxy padroniza os retornos de erro:

404 Not Found para recursos inexistentes

502 Bad Gateway para falhas na comunicação com a API externa

Mensagens de erro com estrutura clara: {"error": "...", "message": "...", "status": ...}

Dessa forma, o frontend consegue implementar feedbacks mais precisos ao usuário e lógicas de fallback mais robustas.

#### ♻️ 5. Otimização de performance e redução de requisições

##### Problema:

A exibição de uma tela frequentemente exigia diversas requisições para múltiplos endpoints da API original, com sobreposição de dados e latência perceptível.

##### Solução:

Algumas dessas requisições foram agregadas no proxy, que passa a retornar:

Objetos compostos contendo múltiplas partes dos dados

Informações pré-processadas e cacheadas em memória, evitando repetição de chamadas a recursos estáticos ou pouco mutáveis

Essa abordagem resultou em uma redução significativa do tempo de carregamento e do número total de requisições feitas pelo cliente.

Para mais detalhes sobre as soluções implementadas no proxy, acesse o repositório do backend proxy em Flask.
### adição de features

#### 1. procurar paradas

#### 1. visualizar itinerário

#### 1. localizar veiculos de qualquer linha

#### 1. calcular rota

[Sreenshot 1](https://raw.githubusercontent.com/jefersonjhone/feirabus/main/images/image1.png)
[Screenshot 3](https://raw.githubusercontent.com/jefersonjhone/feirabus/main/images/image3.png)

## Contribuindo

Este é um projeto para benefício coletivo e contribuições são sempre bem-vindas!

Veja `contribuindo.md` para saber como começar.

Por favor, siga o `código de conduta` desse projeto.

## Autores

- [@jeferson jhone](https://www.github.com/jefersonjhone)

## Licença

[GPL3](https://choosealicense.com/licenses/gpl-3.0/)
