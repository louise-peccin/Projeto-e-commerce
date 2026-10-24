
const { obterBanco } = require("./database");
const { ObjectId } = require("mongodb");

class Categoria {
    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    validar() {
        if (typeof this.nome !== "string" || !this.nome.trim()) {
            throw new Error("Nome da categoria é obrigatório!");
        }

        if (typeof this.descricao !== "string" || !this.descricao.trim()) {
            throw new Error("Descrição da categoria é obrigatória!");
        }
    }

    async cadastrar() {
        this.validar();

        const banco = obterBanco();
        return await banco.collection("categorias").insertOne({
            nome: this.nome.trim(),
            descricao: this.descricao.trim()
        });
    }

    async listar() {
        const banco = obterBanco();
        return await banco.collection("categorias").find({}).toArray();
    }

    async buscarPorId(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID inválido!");
        }

        const banco = obterBanco();
        const categoria = await banco.collection("categorias")
            .findOne({ _id: new ObjectId(id) });

        if (!categoria) {
            throw new Error("Categoria não encontrada!");
        }

        return categoria;
    }

    async atualizar(id, novosDados) {
        const categoria = await this.buscarPorId(id);

        const atualizado = new Categoria(
            novosDados.nome ?? categoria.nome,
            novosDados.descricao ?? categoria.descricao
        );

        atualizado.validar();

        const banco = obterBanco();

        await banco.collection("categorias").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    nome: atualizado.nome.trim(),
                    descricao: atualizado.descricao.trim()
                }
            }
        );

        return "Categoria atualizada com sucesso!";
    }

    async excluir(id) {
        await this.buscarPorId(id);

        const banco = obterBanco();

        const produtos = await banco.collection("produtos").countDocuments({
            categoriaId: new ObjectId(id)
        });

        if (produtos > 0) {
            throw new Error("Existem produtos vinculados a esta categoria!");
        }

        await banco.collection("categorias")
            .deleteOne({ _id: new ObjectId(id) });

        return "Categoria excluída com sucesso!";
    }
}

module.exports = Categoria;
