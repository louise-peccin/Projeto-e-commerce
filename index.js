
const { conectarBanco } = require("./src/database");
const { menu, fecharMenu } = require("./src/menu");

async function iniciar() {
    try {
        await conectarBanco();
        console.log("Sistema E-commerce iniciado!");
        await menu();

    } catch (erro) {
        console.error("Erro:", erro.message);
        process.exitCode = 1;

    } finally {
        fecharMenu();
    }
}

iniciar();
