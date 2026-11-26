import express from 'express';
import {
    listarProdutos,
    formCadastrarProduto,
    cadastrarProduto,
    buscarProdutoPorId,
    atualizarProduto,
    visualizarProduto,
    excluirProduto
} from '../controllers/produtoController.js';

const router = express.Router();

// Listar produtos
router.get('/', listarProdutos);

// Abrir formulário de cadastro
router.get('/novo', formCadastrarProduto);

// Receber formulário e cadastrar produto
router.post('/', cadastrarProduto);

// Buscar produto para edição
router.get('/editar/:id', buscarProdutoPorId);

// Atualizar produto
router.post('/editar/:id', atualizarProduto);

// Excluir produto
router.post('/excluir/:id', excluirProduto);

// Visualizar produto
router.get('/visualizar/:id', visualizarProduto);

export default router;