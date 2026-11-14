# Relatório Técnico — Etapa 01: Ambiente e Infraestrutura

## 1. Objetivo da etapa

Preparar e validar o ambiente de desenvolvimento necessário para a construção da aplicação Art Portfolio.

Esta etapa compreendeu a verificação das ferramentas, instalação e configuração do MySQL Server, organização da estrutura inicial do projeto, configuração do Git e documentação da infraestrutura.

## 2. Ambiente de desenvolvimento

### Sistema operacional
- Windows 11.

### Editor de código
- Visual Studio Code: 1.146.0.
- Arquitetura: x64.

### JavaScript e backend
- Node.js: 22.14.0.
- npm: 10.9.2.

### Python e processamento de imagens
- Python principal: 3.13.2.
- Python alternativo: 3.11.9.
- pip do Python 3.13: 24.3.1.
- pip do Python 3.11: 23.3.2.

### Controle de versão
- Git: 2.42.0.windows.2.

### Banco de dados
- MySQL Server: 8.0.46.
- MySQL Workbench: 8.0.

## 3. Estrutura do projeto

Diretório raiz:

`C:\Users\Gabriel\Documents\art-portifolio`

Estrutura inicial:

```text
art-portifolio/
│
├── backend/
│   └── .gitkeep
│
├── database/
│   └── .gitkeep
│
├── docs/
│   ├── .gitkeep
│   └── ETAPA-01-INFRAESTRUTURA.md
│
├── frontend/
│   └── .gitkeep
│
├── image-service/
│   └── .gitkeep
│
├── storage/
│   └── .gitkeep
│
├── .gitignore
└── README.md
```

### Responsabilidades dos diretórios

- `frontend/`: interface visual e navegação da aplicação.
- `backend/`: API, regras de negócio e comunicação com o banco.
- `database/`: scripts SQL e estrutura do banco de dados.
- `image-service/`: serviço Python para processamento de imagens.
- `storage/`: armazenamento de arquivos e imagens.
- `docs/`: documentação técnica e relatórios do projeto.

Os arquivos `.gitkeep` foram utilizados para manter os diretórios vazios sob controle de versão.

## 4. Configuração do MySQL Server

### Instalação

- Versão instalada: MySQL Server 8.0.46.
- Tipo de configuração: Development Computer.
- Porta TCP/IP: 3306.
- Porta MySQL X Protocol: 33060.
- Método de autenticação: Strong Password Encryption (`caching_sha2_password`).
- Serviço do Windows: `MySQL80`.
- Inicialização do serviço: automática com o Windows.
- Conta de execução: Standard System Account.

### Diretórios identificados

Diretório de instalação:

`C:\Program Files\MySQL\MySQL Server 8.0\`

Diretório de dados:

`C:\ProgramData\MySQL\MySQL Server 8.0\Data\`

### Validações realizadas

Foram executados os seguintes comandos:

```powershell
Get-NetTCPConnection -LocalPort 3306 -State Listen

Test-NetConnection -ComputerName 127.0.0.1 -Port 3306

Get-Service -Name MySQL80
```

Resultados observados:

- Porta 3306 em estado LISTEN.
- Conexão TCP local estabelecida com sucesso.
- Serviço `MySQL80` em execução.
- Processo `mysqld` identificado como responsável pela porta.

### Validação SQL

Foram executadas consultas no MySQL:

```sql
SELECT VERSION();

SELECT USER(), CURRENT_USER();

SHOW VARIABLES LIKE 'port';

SHOW VARIABLES LIKE 'bind_address';

SHOW DATABASES;
```

Resultados:

- Versão: 8.0.46.
- Usuário autenticado: `root@localhost`.
- Porta: 3306.
- `bind_address`: `*`.
- Bancos de sistema identificados: `information_schema`, `mysql`, `performance_schema` e `sys`.

### MySQL Workbench

Foi criada e validada a conexão:

- Nome: `Art Portfolio - Local Server`.
- Método: Standard TCP/IP.
- Host: `127.0.0.1`.
- Porta: `3306`.
- Usuário: `root`.

A conexão foi estabelecida com sucesso, utilizando uma conexão criptografada por TLS.

### Decisões e pendências

- O banco `art_portfolio` ainda não foi criado. Sua implementação pertence à Etapa 03.
- O usuário específico da aplicação ainda não foi criado.
- A senha administrativa não deve ser armazenada neste documento.
- A aplicação não deverá utilizar o usuário `root`.
- A configuração de acesso externo e a exposição da porta no firewall precisam de revisão antes de qualquer disponibilização em rede.

## 5. Configuração do Python

Foram identificadas duas instalações Python:

### Python 3.13.2

Localização:

`C:\Users\Gabriel\AppData\Local\Programs\Python\Python313`

Versão do pip:

`24.3.1`

### Python 3.11.9

Instalação identificada como proveniente da Microsoft Store.

Versão do pip:

`23.3.2`

### Padronização definida

O projeto utilizará inicialmente o Python 3.13, selecionado explicitamente pelo inicializador do Windows:

```powershell
py -3.13
```

Para executar o pip:

```powershell
py -3.13 -m pip
```

Essa abordagem evita depender do alias genérico `python`, que atualmente aponta para o ambiente associado à Microsoft Store.

## 6. Configuração do Node.js

Versões identificadas:

- Node.js: 22.14.0.
- npm: 10.9.2.

O comando `npm` apresentou bloqueio devido à política de execução de scripts do PowerShell.

A funcionalidade do npm foi validada utilizando:

```powershell
npm.cmd --version
```

Resultado: 10.9.2.

A política de execução do PowerShell não foi modificada.

## 7. Configuração do Git

### Identidade global

- Nome: Camilo.
- E-mail: gabbriel.eu@gmail.com.

### Configurações

- Branch inicial: `main`.
- `core.autocrlf`: `true`.
- Repositório inicializado na raiz do projeto.

### Primeiro commit

Hash:

`82c6a12`

Mensagem:

`chore: inicializa estrutura do projeto`

### Estado do repositório

Foi executado:

```powershell
git status
```

Resultado:

`nothing to commit, working tree clean`

O repositório está inicializado e o commit inicial foi confirmado.

## 8. Arquivo .gitignore

Foi criado o arquivo `.gitignore` para evitar o versionamento de arquivos desnecessários ou sensíveis.

Principais exclusões:

- `node_modules/`
- Arquivos `.env`
- Ambientes virtuais Python.
- Arquivos temporários.
- Logs.
- Diretórios de build.
- Arquivos de configuração específicos de editores.

O arquivo `.env.example` permanece permitido para documentar variáveis de ambiente sem incluir credenciais reais.

## 9. README.md

Foi criado o arquivo principal de documentação do projeto.

O documento apresenta:

- Objetivo da aplicação.
- Tecnologias utilizadas.
- Estrutura de diretórios.
- Funcionalidades previstas.
- Etapas de desenvolvimento.
- Estado geral do projeto.

## 10. Problemas encontrados e soluções

### Bloqueio do npm no PowerShell

Problema: execução de `npm.ps1` bloqueada pela política de execução de scripts.

Solução: utilização de `npm.cmd`, mantendo a configuração de segurança original.

### Divergência entre versões Python

Problema: o comando genérico `python` direcionava para o Python 3.11.9, enquanto o Python 3.13.2 estava registrado como versão padrão no inicializador.

Solução: padronização dos comandos do projeto utilizando `py -3.13`.

### Execução de comandos no interpretador Python

Problema: comandos do PowerShell foram digitados dentro do interpretador interativo Python.

Solução: saída do interpretador utilizando `exit()` e execução dos comandos no terminal PowerShell.

### Aviso de final de linha do Git

Problema: aviso sobre conversão de LF para CRLF.

Solução: configuração global `core.autocrlf=true`.

O aviso não representava falha no versionamento.

## 11. Testes e resultados

| Teste | Resultado |
|---|---|
| Node.js | Aprovado |
| npm via npm.cmd | Aprovado |
| Python 3.13 | Aprovado |
| pip Python 3.13 | Aprovado |
| Python 3.11 | Aprovado |
| Git | Aprovado |
| Repositório inicializado | Aprovado |
| Commit inicial | Aprovado |
| Working tree limpa | Aprovado |
| MySQL Server | Aprovado |
| Serviço MySQL80 | Aprovado |
| Porta TCP 3306 | Aprovado |
| Autenticação MySQL | Aprovado |
| Conexão Workbench | Aprovado |
| Estrutura de diretórios | Aprovado |
| Visual Studio Code | Aprovado |

## 12. Pendências

1. Validar a inicialização automática do MySQL após reinicialização do Windows.
2. Revisar as regras de firewall e a exposição da porta 3306.
3. Criar o banco `art_portfolio` na Etapa 03.
4. Criar usuário específico para a aplicação na etapa apropriada.
5. Configurar ambiente virtual Python quando iniciar o serviço de imagens.
6. Implementar dependências Node.js quando iniciar o backend.

## 13. Ponto de continuidade

### Etapa concluída

Etapa 01 — Ambiente e Infraestrutura: preparação básica concluída.

### Estado atual do projeto

- Ambiente de desenvolvimento identificado.
- Ferramentas principais instaladas e verificadas.
- MySQL Server instalado e operacional.
- MySQL Workbench conectado.
- Estrutura de diretórios criada.
- Git inicializado.
- Primeiro commit registrado.
- Documentação inicial criada.

### Último procedimento executado

Validação das versões das ferramentas, confirmação do commit inicial e conferência da estrutura de diretórios.

### Próxima atividade recomendada

Etapa 02 — Frontend.

Iniciar o desenvolvimento da estrutura HTML, identidade visual, organização CSS e navegação da aplicação.

### Dependências necessárias

- VS Code.
- Node.js e npm.
- Git.
- Estrutura inicial do projeto.
- Conhecimentos fundamentais de HTML5, CSS3 e JavaScript.

### Instruções para o próximo chat

Continuar o desenvolvimento do Art Portfolio respeitando a arquitetura previamente definida.

A próxima etapa deverá começar pelos fundamentos de HTML5 e pela estrutura semântica da página inicial.

Não introduzir frameworks frontend. Utilizar HTML5, CSS3 e JavaScript puro (Vanilla JS).

Preservar os diretórios, nomes e decisões técnicas documentados nesta etapa.