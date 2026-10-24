
const readline = require("readline");
const Produto = require("./Produto");
const Categoria = require("./Categoria");
const Vendedor = require("./Vendedor");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(msg) {
    return new Promise(resolve => rl.question(msg, resolve));
}


async function dadosProduto() {
    const nome = await perguntar("Nome: ");
    const valor = await perguntar("Preço: ");
    const quantidade = await perguntar("Quantidade: ");
    const categoriaId = await perguntar("ID da categoria: ");
    const vendedorId = await perguntar("ID do vendedor: ");

    const preco = valor.trim() === "" ? NaN : Number(valor);
    const qtde = quantidade.trim() === "" ? NaN : Number(quantidade);

    return { nome, preco, qtde, categoriaId, vendedorId };
}


async function dadosCategoria() {
    const nome = await perguntar("Nome: ");
    const descricao = await perguntar("Descrição: ");
    return { nome, descricao };
}

async function dadosVendedor() {
    const nome = await perguntar("Nome: ");
    const email = await perguntar("E-mail: ");
    const telefone = await perguntar("Telefone: ");
    return { nome, email, telefone };
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
            if (op === "1") {
                let dados;

                if (tipo === "produto") dados = await dadosProduto();
                if (tipo === "categoria") dados = await dadosCategoria();
                if (tipo === "vendedor") dados = await dadosVendedor();

                const registro = new Classe(...Object.values(dados));
                const resultado = await registro.cadastrar();

                console.log("Cadastrado:", resultado.insertedId);

            } else if (op === "2") {
                console.log(await entidade.listar());

            } else if (op === "3") {
                const id = await perguntar("ID: ");
                console.log(await entidade.buscarPorId(id));

            } else if (op === "4") {
                const id = await perguntar("ID: ");
                console.log("Informe os novos dados:");

                let dados;

                if (tipo === "produto") dados = await dadosProduto();
                if (tipo === "categoria") dados = await dadosCategoria();
                if (tipo === "vendedor") dados = await dadosVendedor();

                console.log(await entidade.atualizar(id, dados));

            } else if (op === "5") {
                const id = await perguntar("ID: ");
                console.log(await entidade.excluir(id));

            } else if (op !== "0") {
                console.log("Opção inválida!");
            }
        } catch (erro) {
            console.error("Erro:", erro.message);
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

        if (op === "1") await gerenciar("produto");
        else if (op === "2") await gerenciar("categoria");
        else if (op === "3") await gerenciar("vendedor");
        else if (op !== "0") console.log("Opção inválida!");

    } while (op !== "0");
}

function fecharMenu() {
    rl.close();
}

module.exports = { menu, fecharMenu };
