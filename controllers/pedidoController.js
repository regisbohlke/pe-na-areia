
import mongoose from 'mongoose';
import Pedido from '../models/Pedido.js';
import Produto from '../models/Produto.js';

// Escapa caracteres especiais da pesquisa
const escaparRegex = (texto) => {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Verifica se o ID informado é válido
const idValido = (id) => {
    return mongoose.isValidObjectId(id);
};

// Lista e pesquisa pedidos
export const listarPedidos = async (req, res) => {
    try {
        const busca = req.query.busca || '';
        const buscaSegura = escaparRegex(busca);

        const pedidos = await Pedido.find({
            $or: [
                { numero: { $regex: buscaSegura, $options: 'i' } },
                { nomeCliente: { $regex: buscaSegura, $options: 'i' } }
            ]
        }).sort({ dataPedido: -1 });

        res.render('admin/pedidos/listar', {
            pedidos,
            busca
        });

    } catch (erro) {
        console.error('Erro ao listar pedidos:', erro);
        res.status(500).send('Erro ao carregar pedidos.');
    }
};

// Visualiza os detalhes de um pedido
export const visualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).send('ID do pedido inválido.');
        }

        const pedido = await Pedido.findById(id)
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

// Atualiza o status do pedido
export const atualizarStatusPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!idValido(id)) {
            return res.status(400).send('ID do pedido inválido.');
        }

        if (typeof status !== 'string' || !status.trim()) {
            return res.status(400).send('Informe um status válido.');
        }

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { status },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.');
        }

        res.redirect(`/admin/pedidos/visualizar/${pedido._id}`);

    } catch (erro) {
        console.error('Erro ao atualizar status:', erro);

        if (erro.name === 'ValidationError' || erro.name === 'CastError') {
            return res.status(400).send('Status informado inválido.');
        }

        res.status(500).send('Erro ao atualizar o status do pedido.');
    }
};

// Atualiza o status do pagamento
export const atualizarPagamentoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusPagamento } = req.body;

        if (!idValido(id)) {
            return res.status(400).send('ID do pedido inválido.');
        }

        if (
            typeof statusPagamento !== 'string' ||
            !statusPagamento.trim()
        ) {
            return res.status(400).send('Informe um status de pagamento válido.');
        }

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { statusPagamento },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.');
        }

        res.redirect(`/admin/pedidos/visualizar/${pedido._id}`);

    } catch (erro) {
        console.error('Erro ao atualizar pagamento:', erro);

        if (erro.name === 'ValidationError' || erro.name === 'CastError') {
            return res.status(400).send('Status de pagamento informado inválido.');
        }

        res.status(500).send('Erro ao atualizar o pagamento do pedido.');
    }
};

// Cadastra um novo pedido
export const cadastrarPedido = async (req, res) => {
    try {
        const { nomeCliente, whatsapp } = req.body;

        // Garante que os campos obrigatórios foram preenchidos
        if (!nomeCliente?.trim() || !whatsapp?.trim()) {
            return res.status(400).send('Preencha o nome do cliente e o WhatsApp.');
        }

        // Recebe os produtos e quantidades enviados pelo formulário
        const produtosSelecionados = Array.isArray(req.body.produtos)
            ? req.body.produtos
            : [req.body.produtos];

        const quantidades = Array.isArray(req.body.quantidades)
            ? req.body.quantidades
            : [req.body.quantidades];

        if (
            !produtosSelecionados.length ||
            produtosSelecionados.some(id => !id || !idValido(id)) ||
            produtosSelecionados.length !== quantidades.length
        ) {
            return res.status(400).send('Selecione produtos válidos.');
        }

        // Verifica se as quantidades são números inteiros positivos
        const quantidadesNumericas = quantidades.map(Number);

        if (quantidadesNumericas.some(q => !Number.isInteger(q) || q < 1)) {
            return res.status(400).send('Informe quantidades válidas.');
        }

        // Impede que o mesmo produto seja adicionado mais de uma vez
        if (new Set(produtosSelecionados).size !== produtosSelecionados.length) {
            return res.status(400).send('Não repita produtos no pedido.');
        }

        // Busca os produtos disponíveis no banco
        const produtosBanco = await Produto.find({
            _id: { $in: produtosSelecionados },
            disponivel: true
        });

        if (produtosBanco.length !== produtosSelecionados.length) {
            return res.status(400).send('Um ou mais produtos não estão disponíveis.');
        }

        // Monta os itens do pedido utilizando os dados do banco
        const itens = produtosSelecionados.map((id, indice) => {
            const produto = produtosBanco.find(
                p => p._id.toString() === id
            );

            const quantidade = quantidadesNumericas[indice];
            const precoUnitario = produto.preco;

            return {
                produto: produto._id,
                nome: produto.nome,
                quantidade,
                precoUnitario,
                subtotal: quantidade * precoUnitario
            };
        });

        // Calcula o valor total
        const valorTotal = itens.reduce(
            (total, item) => total + item.subtotal,
            0
        );

        // Cria o pedido
        const novoPedido = new Pedido({
            numero: `PED-${Date.now()}`,
            nomeCliente: nomeCliente.trim(),
            whatsapp: whatsapp.trim(),
            itens,
            valorTotal
        });

        await novoPedido.save();

        res.redirect('/admin/pedidos');

    } catch (erro) {
        console.error('Erro ao cadastrar pedido:', erro);
        res.status(500).send('Erro ao cadastrar o pedido.');
    }
};
// Exibe o formulário de cadastro de pedido
export const formularioCadastroPedido = async (req, res) => {
    try {
        const produtos = await Produto.find({
            disponivel: true
        }).sort({ nome: 1 });

        res.render('admin/pedidos/cadastrar', {
            produtos
        });

    } catch (erro) {
        console.error('Erro ao carregar formulário de pedido:', erro);
        res.status(500).send('Erro ao carregar o formulário de cadastro.');
    }
};

export const excluirPedido = async (req, res) => {
    try {
        const { id } = req.params;

        if (!idValido(id)) {
            return res.status(400).send('ID do pedido inválido.');
        }

        const pedido = await Pedido.findByIdAndDelete(id);

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.');
        }

        res.redirect('/admin/pedidos');

    } catch (erro) {
        console.error('Erro ao excluir pedido:', erro);
        res.status(500).send('Erro ao excluir o pedido.');
    }
};


