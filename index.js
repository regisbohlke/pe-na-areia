
import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './config/conexao.js';

// Carrega as variáveis do arquivo .env
dotenv.config();

// Inicializa o Express
const app = express();

// Define a porta do servidor
const PORT = 3000;

// Configura o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Permite receber dados de formulários
app.use(express.urlencoded({ extended: true }));

// Permite receber dados em JSON
app.use(express.json());

// Arquivos públicos (CSS, imagens e JavaScript)
app.use(express.static('public'));

// Rota inicial para teste
app.get('/', (req, res) => {
    res.send('Pé na Areia - Sistema de Pedidos');
});

// Inicia o servidor após conectar ao banco
const iniciarServidor = async () => {
    await conectarBanco();

    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
};

iniciarServidor();
