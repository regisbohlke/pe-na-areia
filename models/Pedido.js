
import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: true,
        unique: true
    },
    nomeCliente: {
        type: String,
        required: true,
        trim: true
    },
    whatsapp: {
        type: String,
        required: true,
        trim: true
    },
    itens: [{
        produto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produto',
            required: true
        },
        nome: {
            type: String,
            required: true
        },
        quantidade: {
            type: Number,
            required: true,
            min: 1
        },
        precoUnitario: {
            type: Number,
            required: true,
            min: 0
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    valorTotal: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Recebido', 'Em preparação', 'Pronto', 'Concluído', 'Cancelado'],
        default: 'Recebido'
    },
    statusPagamento: {
        type: String,
        enum: ['Aguardando confirmação', 'Pago', 'Cancelado'],
        default: 'Aguardando confirmação'
    },
    dataPedido: {
        type: Date,
        default: Date.now
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
