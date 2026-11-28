
import Pedido from '../models/Pedido.js';
import Produto from '../models/Produto.js';
import Categoria from '../models/Categoria.js';

export const carregarDashboard = async (req, res) => {
    try {
        // Busca a quantidade de registros de cada entidade
        const totalPedidos = await Pedido.countDocuments();
        const totalProdutos = await Produto.countDocuments();
        const totalCategorias = await Categoria.countDocuments();

        // Conta pedidos que ainda estão em andamento
        const pedidosEmAndamento = await Pedido.countDocuments({
            status: { $in: ['Recebido', 'Em preparação', 'Pronto'] }
        });

        // Busca os cinco pedidos mais recentes
        const pedidos = await Pedido.find()
            .sort({ dataPedido: -1 })
            .limit(5);

        // Indicadores apresentados nos cartões do dashboard
        const indicadores = [
            {
                titulo: 'Total de pedidos',
                valor: totalPedidos,
                detalhe: 'Pedidos registrados'
            },
            {
                titulo: 'Produtos cadastrados',
                valor: totalProdutos,
                detalhe: 'Produtos disponíveis no sistema'
            },
            {
                titulo: 'Categorias cadastradas',
                valor: totalCategorias,
                detalhe: 'Categorias registradas'
            },
            {
                titulo: 'Pedidos em andamento',
                valor: pedidosEmAndamento,
                detalhe: 'Pedidos ainda não concluídos'
            }
        ];

        // Funções de formatação utilizadas pela tela EJS
        const formatar = {
            data: (data) => new Date(data).toLocaleString('pt-BR'),

            moeda: (valor) => Number(valor).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }),

            status: (status) => {
                const cores = {
                    'Recebido': 'bg-primary',
                    'Em preparação': 'bg-warning text-dark',
                    'Pronto': 'bg-info text-dark',
                    'Concluído': 'bg-success',
                    'Cancelado': 'bg-danger'
                };

                return cores[status] || 'bg-secondary';
            }
        };

        res.render('admin/dashboard', {
            erro: false,
            indicadores,
            pedidos,
            formatar
        });

    } catch (erro) {
        console.error('Erro ao carregar dashboard:', erro);

        res.status(500).render('admin/dashboard', {
            erro: true,
            indicadores: [],
            pedidos: [],
            formatar: {
                data: () => '',
                moeda: () => '',
                status: () => 'bg-secondary'
            }
        });
    }
};
