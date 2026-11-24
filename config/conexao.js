
import mongoose from 'mongoose';
import dns from 'node:dns';

// Configura DNS públicos para resolver o endereço do MongoDB
dns.setServers(['8.8.8.8', '1.1.1.1']);

const conectarBanco = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado com sucesso!');
    } catch (erro) {
        console.error('Erro ao conectar ao MongoDB:', erro.message);
        process.exit(1);
    }
};

export default conectarBanco;
