
const { conectarBanco, fecharBanco } = require("./src/database");
const { menu, fecharMenu } = require("./src/menu");
const { registrarErro } = require("./src/logger");

async function iniciar() {
    try {
        await conectarBanco();
        console.log("Sistema E-commerce iniciado!");

        await menu();

    } catch (erro) {
        console.error("Erro:", erro.message);
        registrarErro(erro, "Inicialização do sistema");
        process.exitCode = 1;

    } finally {
        fecharMenu();
        await fecharBanco();
    }
}

iniciar();
