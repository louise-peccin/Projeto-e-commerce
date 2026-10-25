
const readline = require("readline");
const Produto = require("./Produto");
const Categoria = require("./Categoria");
const Vendedor = require("./Vendedor");
const { registrarErro } = require("./logger");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(msg) {
    return new Promise(resolve => rl.question(msg, resolve));
}

function converterNumero(valor) {
    return valor.trim() === "" ? NaN : Number(valor);
}

async function dadosProduto(atualizar = false) {
    const nome = await perguntar("Nome: ");
    const valor = await perguntar("Preço: ");
    const quantidade = await perguntar("Quantidade: ");
    const categoriaId = await perguntar("ID da categoria: ");
    const vendedorId = await perguntar("ID do vendedor: ");

    const dados = {
        nome,
        preco: converterNumero(valor),
        qtde: converterNumero(quantidade),
        categoriaId,
        vendedorId
    };

    if (atualizar) {
        if (nome === "") delete dados.nome;
        if (valor.trim() === "") delete dados.preco;
        if (quantidade.trim() === "") delete dados.qtde;
        if (categoriaId === "") delete dados.categoriaId;
        if (vendedorId === "") delete dados.vendedorId;
    }

    return dados;
}

async function dadosCategoria(atualizar = false) {
    const nome = await perguntar("Nome: ");
    const descricao = await perguntar("Descrição: ");

    const dados = { nome, descricao };

    if (atualizar) {
        if (nome === "") delete dados.nome;
        if (descricao === "") delete dados.descricao;
    }

    return dados;
}

async function dadosVendedor(atualizar = false) {
    const nome = await perguntar("Nome: ");
    const email = await perguntar("E-mail: ");
    const telefone = await perguntar("Telefone: ");

    const dados = { nome, email, telefone };

    if (atualizar) {
        if (nome === "") delete dados.nome;
        if (email === "") delete dados.email;
        if (telefone === "") delete dados.telefone;
    }

    return dados;
}

async function solicitarDados(tipo, atualizar = false) {
    if (tipo === "produto") return dadosProduto(atualizar);
    if (tipo === "categoria") return dadosCategoria(atualizar);
    return dadosVendedor(atualizar);
}

async function gerenciar(tipo) {
    const classes = {
        produto: Produto,
        categoria: Categoria,
        vendedor: Vendedor
    };

    const Classe = classes[tipo];
    const entidade = new Classe();

    let op;

    do {
        console.log(`\n===== ${tipo.toUpperCase()} =====`);
        console.log("1 - Cadastrar");
        console.log("2 - Listar");
        console.log("3 - Buscar por ID");
        console.log("4 - Atualizar");
        console.log("5 - Excluir");
        console.log("0 - Voltar");

        op = (await perguntar("Escolha: ")).trim();

        try {
            switch (op) {
                case "1": {
                    const dados = await solicitarDados(tipo);
                    const registro = new Classe(...Object.values(dados));
                    const resultado = await registro.cadastrar();

                    console.log("Cadastrado:", resultado.insertedId);
                    break;
                }

                case "2": {
                    console.log(await entidade.listar());
                    break;
                }

                case "3": {
                    const id = (await perguntar("ID: ")).trim();
                    console.log(await entidade.buscarPorId(id));
                    break;
                }

                case "4": {
                    const id = (await perguntar("ID: ")).trim();

                    console.log("Informe os novos dados.");
                    console.log("Pressione Enter para manter um campo.");

                    const dados = await solicitarDados(tipo, true);

                    if (Object.keys(dados).length === 0) {
                        console.log("Nenhuma alteração informada.");
                        break;
                    }

                    console.log(await entidade.atualizar(id, dados));
                    break;
                }

                case "5": {
                    const id = (await perguntar("ID: ")).trim();
                    const confirma = await perguntar(
                        "Confirma exclusão? (s/n): "
                    );

                    if (confirma.trim().toLowerCase() === "s") {
                        console.log(await entidade.excluir(id));
                    } else {
                        console.log("Exclusão cancelada.");
                    }
                    break;
                }

                case "0":
                    break;

                default:
                    console.log("Opção inválida!");
            }
        } catch (erro) {
            console.error("Erro:", erro.message);
            registrarErro(erro, `${tipo} - opção ${op}`);
        }

    } while (op !== "0");
}

async function menu() {
    let op;

    do {
        console.log("\n===== E-COMMERCE =====");
        console.log("1 - Produtos");
        console.log("2 - Categorias");
        console.log("3 - Vendedores");
        console.log("0 - Sair");

        op = (await perguntar("Escolha: ")).trim();

        try {
            if (op === "1") {
                await gerenciar("produto");
            } else if (op === "2") {
                await gerenciar("categoria");
            } else if (op === "3") {
                await gerenciar("vendedor");
            } else if (op === "0") {
                console.log("Encerrando sistema...");
            } else {
                console.log("Opção inválida!");
            }
        } catch (erro) {
            console.error("Erro:", erro.message);
            registrarErro(erro, "Menu principal");
        }

    } while (op !== "0");
}

function fecharMenu() {
    rl.close();
}

module.exports = { menu, fecharMenu };
