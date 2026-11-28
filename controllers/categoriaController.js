
import mongoose from 'mongoose';
import Categoria from '../models/Categoria.js';
import Produto from '../models/Produto.js';

// Listar e pesquisar categorias
export const listarCategorias = async (req, res) => {
    try {
        const busca = req.query.busca || '';

        const categorias = await Categoria.find({
            nome: { $regex: busca, $options: 'i' }
        }).sort({ ordemExibicao: 1, nome: 1 });

        res.render('admin/categorias/listar', {
            categorias,
            busca
        });

    } catch (erro) {
        console.error('Erro ao listar categorias:', erro);
        res.status(500).send('Erro ao carregar categorias.');
    }
};

// Cadastrar categoria
export const cadastrarCategoria = async (req, res) => {
    try {
        const { nome, descricao, ordemExibicao, ativo } = req.body;

        // Validar campos obrigatórios
        if (!nome || !nome.trim()) {
            return res.status(400).send('O nome da categoria é obrigatório.');
        }

        // Validar ordem de exibição
        const ordem = ordemExibicao === '' || ordemExibicao === undefined
            ? 0
            : Number(ordemExibicao);

        if (!Number.isInteger(ordem) || ordem < 0) {
            return res.status(400).send(
                'A ordem de exibição deve ser um número inteiro não negativo.'
            );
        }

        const novaCategoria = new Categoria({
            nome: nome.trim(),
            descricao: descricao || '',
            ordemExibicao: ordem,
            ativo: ativo === 'true'
        });

        await novaCategoria.save();

        res.redirect('/admin/categorias');

    } catch (erro) {
        console.error('Erro ao cadastrar categoria:', erro);
        res.status(500).send('Erro ao cadastrar categoria.');
    }
};

// Buscar categoria para edição
export const buscarCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID de categoria inválido.');
        }

        const categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(404).send('Categoria não encontrada.');
        }

        res.render('admin/categorias/editar', {
            categoria
        });

    } catch (erro) {
        console.error('Erro ao buscar categoria:', erro);
        res.status(500).send('Erro ao carregar categoria.');
    }
};

// Atualizar categoria
export const atualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, ordemExibicao, ativo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID de categoria inválido.');
        }

        if (!nome || !nome.trim()) {
            return res.status(400).send('O nome da categoria é obrigatório.');
        }

        const ordem = ordemExibicao === '' || ordemExibicao === undefined
            ? 0
            : Number(ordemExibicao);

        if (!Number.isInteger(ordem) || ordem < 0) {
            return res.status(400).send(
                'A ordem de exibição deve ser um número inteiro não negativo.'
            );
        }

        const categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(404).send('Categoria não encontrada.');
        }

        categoria.nome = nome.trim();
        categoria.descricao = descricao || '';
        categoria.ordemExibicao = ordem;
        categoria.ativo = ativo === 'true';

        await categoria.save();

        res.redirect('/admin/categorias');

    } catch (erro) {
        console.error('Erro ao atualizar categoria:', erro);
        res.status(500).send('Erro ao atualizar categoria.');
    }
};

// Excluir categoria
export const excluirCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID de categoria inválido.');
        }

        const categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(404).send('Categoria não encontrada.');
        }

        // Verificar se existem produtos vinculados à categoria
        const produtosVinculados = await Produto.exists({
            categoria: id
        });

        if (produtosVinculados) {
            return res.status(400).send(
                'Não é possível excluir esta categoria, pois existem produtos vinculados a ela.'
            );
        }

        await categoria.deleteOne();

        res.redirect('/admin/categorias');

    } catch (erro) {
        console.error('Erro ao excluir categoria:', erro);
        res.status(500).send('Erro ao excluir categoria.');
    }
};

// Visualizar categoria
export const visualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('ID de categoria inválido.');
        }

        const categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(404).send('Categoria não encontrada.');
        }

        res.render('admin/categorias/visualizar', {
            categoria
        });

    } catch (erro) {
        console.error('Erro ao visualizar categoria:', erro);
        res.status(500).send('Erro ao carregar categoria.');
    }
};
