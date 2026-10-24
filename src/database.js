
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let banco;

async function conectarBanco() {
    try {
        await client.connect();

        banco = client.db("ecommerce");

        console.log("Conectado ao MongoDB!");
        return banco;

    } catch (erro) {
        console.error("Erro ao conectar ao MongoDB:", erro.message);
        throw erro;
    }
}

function obterBanco() {
    if (!banco) {
        throw new Error("Banco de dados não conectado.");
    }

    return banco;
}

module.exports = { conectarBanco, obterBanco };
