
import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        default: ''
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    imagem: {
        type: String,
        default: ''
    },
    disponivel: {
        type: Boolean,
        default: true
    }
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;
