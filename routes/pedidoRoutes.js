
import express from 'express';

import {
    listarPedidos,
    visualizarPedido,
    atualizarStatusPedido,
    atualizarPagamentoPedido,
    cadastrarPedido,
    formularioCadastroPedido,
    excluirPedido
} from '../controllers/pedidoController.js';
const router = express.Router();

router.get('/', listarPedidos);

router.get('/visualizar/:id', visualizarPedido);

router.get('/cadastrar', formularioCadastroPedido);

router.post('/atualizar-status/:id', atualizarStatusPedido);
router.post('/atualizar-pagamento/:id', atualizarPagamentoPedido);
router.post('/cadastrar', cadastrarPedido);
router.post('/excluir/:id', excluirPedido);
export default router;
