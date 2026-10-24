# Projeto 1 — E-commerce

## 1. Descrição

Sistema de gerenciamento de E-commerce desenvolvido em Node.js, utilizando MongoDB para armazenamento dos dados.

A aplicação permite cadastrar, consultar, atualizar e excluir produtos, categorias e vendedores por meio de um menu interativo no terminal.

## 2. Tecnologias utilizadas

- JavaScript
- Node.js
- MongoDB
- MongoDB Driver para Node.js
- Módulos nativos `readline`, `fs` e `path`

## 3. Entidades

**Produto**
- nome
- preco
- qtde
- categoriaId
- vendedorId

**Categoria**
- nome
- descricao

**Vendedor**
- nome
- email
- telefone

Cada entidade possui sua própria classe JavaScript e coleção no MongoDB.

## 4. Funcionalidades

- Cadastro de produtos, categorias e vendedores
- Listagem dos registros cadastrados
- Busca de registros por ID
- Atualização de informações
- Exclusão de registros
- Validação dos dados obrigatórios
- Verificação dos relacionamentos
- Tratamento de exceções
- Registro de erros em arquivo de log

## 5. Requisitos

- Node.js e npm instalados
- MongoDB Community Server instalado e em execução

O MongoDB Compass pode ser utilizado para visualizar os dados.

## 6. Instalação

Abra o terminal na pasta principal do projeto e execute:

```bash
npm install
```

Esse comando instala as dependências declaradas no `package.json`.

## 7. Configuração do MongoDB

O projeto utiliza uma conexão local com o endereço:

```text
mongodb://127.0.0.1:27017
```

O banco de dados utilizado é `ecommerce`, com as coleções:

- `produtos`
- `categorias`
- `vendedores`

Antes de iniciar o sistema, verifique se o serviço MongoDB está funcionando.

## 8. Execução

No terminal, execute:

```bash
node index.js
```

O sistema apresentará um menu com opções para gerenciar produtos, categorias e vendedores.

O usuário poderá escolher a entidade e realizar operações de cadastro, consulta, atualização e exclusão.

## 9. Tratamento de erros

O sistema utiliza `try/catch` para capturar exceções e apresentar mensagens de erro.

Os erros capturados são registrados em `logs/errors.log`, contendo data, horário, operação e mensagem.

## 10. Integrante

**Nome:** Louise Paccola Peccin  
**RA:** 2475502  
**Projeto:** E-commerce — Programação Web Back-End  
**Instituição:** Universidade Tecnológica Federal do Paraná (UTFPR)
