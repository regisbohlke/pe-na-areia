import express from 'express';
import { listarCategorias,
         cadastrarCategoria,
         buscarCategoriaPorId, 
        atualizarCategoria,
        excluirCategoria,
        visualizarCategoria } from '../controllers/categoriaController.js';

const router = express.Router();


// Listar categorias
router.get('/', listarCategorias);

// Abrir formulário de cadastro
router.get('/nova', (req, res) => {
    res.render('admin/categorias/cadastrar');
});

// Receber formulário e cadastrar categoria
router.post('/', cadastrarCategoria);

// Buscar categoria para edição
router.get('/editar/:id', buscarCategoriaPorId);

// Atualizar categoria
router.post('/editar/:id', atualizarCategoria);
// excluir categoria
router.post('/excluir/:id', excluirCategoria);
// visualizar
router.get('/visualizar/:id', visualizarCategoria);

export default router;