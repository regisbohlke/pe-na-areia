import Produto from '../models/Produto.js';
import Categoria from '../models/Categoria.js';

// Listar e pesquisar produtos
export const listarProdutos = async (req, res) => {
    try {
        const busca = req.query.busca || '';

        const produtos = await Produto.find({
            nome: { $regex: busca, $options: 'i' }
        })
            .populate('categoria')
            .sort({ nome: 1 });

        res.render('admin/produtos/listar', {
            produtos,
            busca
        });
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        res.status(500).send('Erro ao carregar produtos');
    }
};

// Abrir formulário de cadastro carregando as categorias ativas
export const formCadastrarProduto = async (req, res) => {
    try {
        const categorias = await Categoria.find({ ativo: true }).sort({ ordemExibicao: 1, nome: 1 });
        res.render('admin/produtos/cadastrar', { categorias });
    } catch (erro) {
        console.error('Erro ao carregar formulário de produto:', erro);
        res.status(500).send('Erro ao carregar formulário');
    }
};

// Receber formulário e cadastrar produto
export const cadastrarProduto = async (req, res) => {
    try {
        const { nome, descricao, preco, categoria, imagem, disponivel } = req.body;

        const novoProduto = new Produto({
            nome,
            descricao,
            preco: parseFloat(preco),
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
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        const categorias = await Categoria.find({ ativo: true }).sort({ ordemExibicao: 1, nome: 1 });

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
        const { nome, descricao, preco, categoria, imagem, disponivel } = req.body;

        await Produto.findByIdAndUpdate(
            req.params.id,
            {
                nome,
                descricao,
                preco: parseFloat(preco),
                categoria,
                imagem,
                disponivel: disponivel === 'true'
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        res.redirect('/admin/produtos');
    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro);
        res.status(500).send('Erro ao atualizar produto');
    }
};

// Visualizar detalhes de um produto
export const visualizarProduto = async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id).populate('categoria');
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
        await Produto.findByIdAndDelete(id);
        res.redirect('/admin/produtos');
    } catch (erro) {
        console.error('Erro ao excluir produto:', erro);
        res.status(500).send('Erro ao excluir produto');
    }
};