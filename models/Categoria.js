
import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        default: ''
    },
    ordemExibicao: {
        type: Number,
        default: 0
    },
    ativo: {
        type: Boolean,
        default: true
    }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
