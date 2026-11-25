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