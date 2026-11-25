
import Pedido from '../models/Pedido.js';

export const listarPedidos = async (req, res) => {
    try {
        const busca = req.query.busca || '';

        const pedidos = await Pedido.find({
            $or: [
                { numero: { $regex: busca, $options: 'i' } },
                { nomeCliente: { $regex: busca, $options: 'i' } }
            ]
        })
        .sort({ dataPedido: -1 });

        res.render('admin/pedidos/listar', {
            pedidos,
            busca
        });

    } catch (erro) {
        console.error('Erro ao listar pedidos:', erro);
        res.status(500).send('Erro ao carregar pedidos.');
    }
};

export const visualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id)
            .populate('itens.produto');

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.');
        }

        res.render('admin/pedidos/visualizar', {
            pedido
        });

    } catch (erro) {
        console.error('Erro ao visualizar pedido:', erro);
        res.status(500).send('Erro ao carregar os detalhes do pedido.');
    }
};
export const atualizarStatusPedido = async (req, res) => {
    try {
        const { status } = req.body;

        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.');
        }

       res.redirect(`/admin/pedidos/visualizar/${pedido._id}`);

    } catch (erro) {
        console.error('Erro ao atualizar status:', erro);
        res.status(500).send('Erro ao atualizar o status do pedido.');
    }
};
export const atualizarPagamentoPedido = async (req, res) => {
    try {
        const { statusPagamento } = req.body;

        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { statusPagamento },
            { new: true, runValidators: true }
        );

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.');
        }

        res.redirect(`/admin/pedidos/visualizar/${pedido._id}`);

    } catch (erro) {
        console.error('Erro ao atualizar pagamento:', erro);
        res.status(500).send('Erro ao atualizar o pagamento do pedido.');
    }
};