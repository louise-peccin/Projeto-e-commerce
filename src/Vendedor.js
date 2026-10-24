
const { obterBanco } = require("./database");
const { ObjectId } = require("mongodb");

class Vendedor {
    constructor(nome, email, telefone) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    validar() {
        if (typeof this.nome !== "string" || !this.nome.trim()) {
            throw new Error("Nome do vendedor é obrigatório!");
        }

        if (typeof this.email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            throw new Error("E-mail inválido!");
        }

        if (typeof this.telefone !== "string" ||
            !this.telefone.trim()) {
            throw new Error("Telefone é obrigatório!");
        }
    }

    async cadastrar() {
        this.validar();

        const banco = obterBanco();
        return await banco.collection("vendedores").insertOne({
            nome: this.nome.trim(),
            email: this.email.trim(),
            telefone: this.telefone.trim()
        });
    }

    async listar() {
        const banco = obterBanco();
        return await banco.collection("vendedores").find({}).toArray();
    }

    async buscarPorId(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID inválido!");
        }

        const banco = obterBanco();
        const vendedor = await banco.collection("vendedores")
            .findOne({ _id: new ObjectId(id) });

        if (!vendedor) {
            throw new Error("Vendedor não encontrado!");
        }

        return vendedor;
    }

    async atualizar(id, novosDados) {
        const vendedor = await this.buscarPorId(id);

        const atualizado = new Vendedor(
            novosDados.nome ?? vendedor.nome,
            novosDados.email ?? vendedor.email,
            novosDados.telefone ?? vendedor.telefone
        );

        atualizado.validar();

        const banco = obterBanco();

        await banco.collection("vendedores").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    nome: atualizado.nome.trim(),
                    email: atualizado.email.trim(),
                    telefone: atualizado.telefone.trim()
                }
            }
        );

        return "Vendedor atualizado com sucesso!";
    }

    async excluir(id) {
        await this.buscarPorId(id);

        const banco = obterBanco();

        const produtos = await banco.collection("produtos").countDocuments({
            vendedorId: new ObjectId(id)
        });

        if (produtos > 0) {
            throw new Error("Existem produtos vinculados a este vendedor!");
        }

        await banco.collection("vendedores")
            .deleteOne({ _id: new ObjectId(id) });

        return "Vendedor excluído com sucesso!";
    }
}

module.exports = Vendedor;
