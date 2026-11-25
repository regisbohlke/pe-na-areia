import Categoria from '../models/Categoria.js';

export const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find()
            .sort({ ordemExibicao: 1, nome: 1 });

        res.render('admin/categorias/listar', { categorias });

    } catch (erro) {
        console.error('Erro ao listar categorias:', erro);
        res.status(500).send('Erro ao carregar categorias.');
    }
};

export const cadastrarCategoria = async (req, res) => {
    try {
        const { nome, descricao, ordemExibicao, ativo } = req.body;

        const novaCategoria = new Categoria({
            nome,
            descricao,
            ordemExibicao: ordemExibicao || 0,
            ativo: ativo === 'true'
        });

        await novaCategoria.save();

        res.redirect('/admin/categorias');

    } catch (erro) {
        console.error('Erro ao cadastrar categoria:', erro);
        res.status(500).send('Erro ao cadastrar categoria.');
    }
};

export const buscarCategoriaPorId = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);

        if (!categoria) {
            return res.status(404).send('Categoria não encontrada.');
        }

        res.render('admin/categorias/editar', { categoria });

    } catch (erro) {
        console.error('Erro ao buscar categoria:', erro);
        res.status(500).send('Erro ao carregar categoria.');
    }
};
export const atualizarCategoria = async (req, res) => {
    try {
        const { nome, descricao, ordemExibicao, ativo } = req.body;

        await Categoria.findByIdAndUpdate(
            req.params.id,
            {
                nome,
                descricao,
                ordemExibicao: ordemExibicao || 0,
                ativo: ativo === 'true'
            },
            {
                
              returnDocument: 'after',
              runValidators: true

            }
        );

        res.redirect('/admin/categorias');

    } catch (erro) {
        console.error('Erro ao atualizar categoria:', erro);
        res.status(500).send('Erro ao atualizar categoria.');
    }
};