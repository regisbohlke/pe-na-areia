
import express from 'express';

import {
    listarPedidos,
    visualizarPedido,
    atualizarStatusPedido,
    atualizarPagamentoPedido
} from '../controllers/pedidoController.js';
const router = express.Router();

router.get('/', listarPedidos);

router.get('/visualizar/:id', visualizarPedido);

router.post('/atualizar-status/:id', atualizarStatusPedido);
router.post('/atualizar-pagamento/:id', atualizarPagamentoPedido);
export default router;
