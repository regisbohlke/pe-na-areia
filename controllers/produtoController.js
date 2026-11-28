
import mongoose from 'mongoose';
import Produto from '../models/Produto.js';
import Categoria from '../models/Categoria.js';
import Pedido from '../models/Pedido.js';

// Listar e pesquisar produtos
export const listarProdutos = async (req, res) => {
    try {
        const busca = req.query.busca || '';

        const produtos = await Produto.find({
            nome: { $regex: busca, $options: 'i' }
        })
            .populate('categoria')
            .sort({ nome: 1 });

        res.render('admin/produtos/listar', { produtos, busca });

    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        res.status(500).send('Erro ao carregar produtos');
    }
};

// Abrir formulário de cadastro
export const formCadastrarProduto = async (req, res) => {
    try {
        const categorias = await Categoria.find({ ativo: true })
            .sort({ ordemExibicao: 1, nome: 1 });

        res.render('admin/produtos/cadastrar', { categorias });

    } catch (erro) {
        console.error('Erro ao carregar formulário de produto:', erro);
        res.status(500).send('Erro ao carregar formulário');
    }
};

// Cadastrar produto
export const cadastrarProduto = async (req, res) => {
    try {
        const {
            nome,
            descricao,
            preco,
            categoria,
            imagem,
            disponivel
        } = req.body;

        // Verifica os campos obrigatórios
        if (!nome || !nome.trim() || preco === undefined || preco === '' || !categoria) {
            return res.status(400).send(
                'Preencha o nome, o preço e a categoria do produto.'
            );
        }

        // Valida o preço
        const precoNumerico = Number(preco);

        if (!Number.isFinite(precoNumerico) || precoNumerico < 0) {
            return res.status(400).send('Informe um preço válido.');
        }

        // Valida o ID da categoria
        if (!mongoose.Types.ObjectId.isValid(categoria)) {
            return res.status(400).send('ID da categoria inválido.');
        }

        // Verifica se a categoria existe e está ativa
        const categoriaExiste = await Categoria.findOne({
            _id: categoria,
            ativo: true
        });

        if (!categoriaExiste) {
            return res.status(400).send(
                'Categoria não encontrada ou inativa.'
            );
        }

        // Cria o produto
        const novoProduto = new Produto({
            nome: nome.trim(),
            descricao,
            preco: precoNumerico,
            categoria,
            imagem,
            disponivel: disponivel === 'true'
        });

        await novoProduto.save();

        res.redirect('/admin/produtos');

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);
        res.status(500).send('Erro ao cadastrar produto');
    }
};

// Buscar produto por ID para edição
export const buscarProdutoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Valida o ID do produto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID do produto inválido.');
        }

        const produto = await Produto.findById(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        // Busca categorias ativas e também a categoria atual do produto
        const categorias = await Categoria.find({
            $or: [
                { ativo: true },
                { _id: produto.categoria }
            ]
        }).sort({ ordemExibicao: 1, nome: 1 });

        res.render('admin/produtos/editar', {
            produto,
            categorias
        });

    } catch (erro) {
        console.error('Erro ao buscar produto para edição:', erro);
        res.status(500).send('Erro ao carregar produto');
    }
};

// Atualizar produto
export const atualizarProduto = async (req, res) => {
    try {
        const { id } = req.params;

        // Valida o ID do produto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID do produto inválido.');
        }

        const {
            nome,
            descricao,
            preco,
            categoria,
            imagem,
            disponivel
        } = req.body;

        // Verifica se o produto existe
        const produto = await Produto.findById(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        // Verifica os campos obrigatórios
        if (!nome || !nome.trim() || preco === undefined || preco === '' || !categoria) {
            return res.status(400).send(
                'Preencha o nome, o preço e a categoria do produto.'
            );
        }

        // Valida o preço
        const precoNumerico = Number(preco);

        if (!Number.isFinite(precoNumerico) || precoNumerico < 0) {
            return res.status(400).send('Informe um preço válido.');
        }

        // Valida o ID da categoria
        if (!mongoose.Types.ObjectId.isValid(categoria)) {
            return res.status(400).send('ID da categoria inválido.');
        }

        // Verifica se a categoria existe
        const categoriaExiste = await Categoria.findById(categoria);

        if (!categoriaExiste) {
            return res.status(400).send('Categoria não encontrada.');
        }

        // Impede selecionar outra categoria inativa
        if (
            !categoriaExiste.ativo &&
            produto.categoria.toString() !== categoriaExiste._id.toString()
        ) {
            return res.status(400).send(
                'Não é possível selecionar uma categoria inativa.'
            );
        }

        // Atualiza os dados do produto
        produto.nome = nome.trim();
        produto.descricao = descricao;
        produto.preco = precoNumerico;
        produto.categoria = categoria;
        produto.imagem = imagem;
        produto.disponivel = disponivel === 'true';

        await produto.save();

        res.redirect('/admin/produtos');

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);
        res.status(500).send('Erro ao atualizar produto');
    }
};

// Visualizar detalhes de um produto
export const visualizarProduto = async (req, res) => {
    try {
        const { id } = req.params;

        // Valida o ID do produto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID do produto inválido.');
        }

        const produto = await Produto.findById(id)
            .populate('categoria');

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        res.render('admin/produtos/visualizar', { produto });

    } catch (erro) {
        console.error('Erro ao visualizar produto:', erro);
        res.status(500).send('Erro ao visualizar produto');
    }
};

// Excluir produto
export const excluirProduto = async (req, res) => {
    try {
        const { id } = req.params;

        // Valida o ID do produto
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID do produto inválido.');
        }

        const produto = await Produto.findById(id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        // Verifica se o produto está vinculado a algum pedido
        const produtoEmPedido = await Pedido.exists({
            'itens.produto': id
        });

        if (produtoEmPedido) {
            return res.status(400).send(
                'Não é possível excluir este produto, pois ele está vinculado a um pedido.'
            );
        }

        await produto.deleteOne();

        res.redirect('/admin/produtos');

    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);
        res.status(500).send('Erro ao excluir produto');
    }
};
