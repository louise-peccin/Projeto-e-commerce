const { obterBanco } = require("./database");
const { ObjectId } = require("mongodb");

class Produto{
    constructor(nome, preco, qtde, categoriaId, vendedorId){
        this.nome = nome;
        this.preco = preco;
        this.qtde = qtde;
        this.categoriaId = categoriaId;
        this.vendedorId = vendedorId;
    }

    validar() {
        if (typeof this.nome !== "string" || !this.nome.trim()) {
            throw new Error("O nome do produto é obrigatório!");
        }
        if (typeof this.preco !== "number" ||
            !Number.isFinite(this.preco) ||
            this.preco < 0) {
            throw new Error("Preço inválido!");
        }
        if (typeof this.qtde !== "number" ||
            !Number.isInteger(this.qtde) ||
            this.qtde < 0) {
            throw new Error("Quantidade inválida!");
        }

        if (!ObjectId.isValid(this.categoriaId)) {
            throw new Error("Categoria inválida!");
        }
        
        if (!ObjectId.isValid(this.vendedorId)) {
            throw new Error("Vendedor inválido!");
        }
    }

    
    async cadastrar() {
        this.validar();

        const banco = obterBanco();

        const categoriaId = new ObjectId(this.categoriaId);
        const vendedorId = new ObjectId(this.vendedorId);

        const categoria = await banco.collection("categorias")
            .findOne({ _id: categoriaId });

        const vendedor = await banco.collection("vendedores")
            .findOne({ _id: vendedorId });

        if (!categoria) {
            throw new Error("Categoria não encontrada!");
        }

        if (!vendedor) {
            throw new Error("Vendedor não encontrado!");
        }

        return await banco.collection("produtos").insertOne({
            nome: this.nome.trim(),
            preco: this.preco,
            qtde: this.qtde,
            categoriaId: categoriaId,
            vendedorId: vendedorId
        });
    }


    async listar(){
        const banco = obterBanco();
        return await banco.collection("produtos").find({}).toArray();
    }

    async buscarPorId(id){
        if(!ObjectId.isValid(id)){
            throw new Error("ID inválido");
        }

        const banco = obterBanco();
        const produto = await banco.collection("produtos").findOne({
            _id: new ObjectId(id)
        });

        if(!produto){
            throw new Error("Produto não encontrado!")
        }

        return produto;
    }

    
    async atualizar(id, novosDados) {
        const produto = await this.buscarPorId(id);

        const atualizado = new Produto(
            novosDados.nome ?? produto.nome,
            novosDados.preco ?? produto.preco,
            novosDados.qtde ?? produto.qtde,
            novosDados.categoriaId ?? produto.categoriaId,
            novosDados.vendedorId ?? produto.vendedorId
        );

        atualizado.validar();

        const banco = obterBanco();
        const categoriaId = new ObjectId(atualizado.categoriaId);
        const vendedorId = new ObjectId(atualizado.vendedorId);

        const categoria = await banco.collection("categorias")
            .findOne({ _id: categoriaId });

        const vendedor = await banco.collection("vendedores")
            .findOne({ _id: vendedorId });

        if (!categoria) {
            throw new Error("Categoria não encontrada!");
        }

        if (!vendedor) {
            throw new Error("Vendedor não encontrado!");
        }

        const resultado = await banco.collection("produtos").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    nome: atualizado.nome.trim(),
                    preco: atualizado.preco,
                    qtde: atualizado.qtde,
                    categoriaId,
                    vendedorId
                }
            }
        );

        if (resultado.matchedCount === 0) {
            throw new Error("Produto não encontrado!");
        }

        return "Produto atualizado com sucesso!";
    }


    async excluir(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error("ID inválido!");
        }
    
        const banco = obterBanco();
    
        const resultado = await banco.collection("produtos").deleteOne({
            _id: new ObjectId(id)
        });
    
        if (resultado.deletedCount === 0) {
            throw new Error("Produto não encontrado!");
        }
    
        return "Produto excluído com sucesso!";
    }

}

module.exports = Produto;

