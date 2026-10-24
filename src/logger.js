
const fs = require("fs");
const path = require("path");

const pasta = path.join(__dirname, "../logs");
const arquivo = path.join(pasta, "errors.log");

function registrarErro(erro, operacao) {
    const data = new Date().toLocaleString("pt-BR");

    const log = `[${data}]
OPERAÇÃO: ${operacao}
ERRO: ${erro.name}
MENSAGEM: ${erro.message}

`;

    fs.mkdirSync(pasta, { recursive: true });
    fs.appendFileSync(arquivo, log);
}

module.exports = { registrarErro };
