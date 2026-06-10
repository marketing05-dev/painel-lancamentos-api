const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Banco de dados em memória (inicia zerado toda vez que o servidor for atualizado)
let metrics = {
    visits: 0,
    previousVisits: 100, // Substitua pelo seu número base real de visitas
    viewsByProduct: {},
    viewsByBrand: {},
    purchasesByProduct: {}
};

app.post('/track', (req, res) => {
    const { eventType, product, brand } = req.body;

    if (eventType === 'page_view') {
        metrics.visits++;
    } else if (eventType === 'view_item') {
        if (product) metrics.viewsByProduct[product] = (metrics.viewsByProduct[product] || 0) + 1;
        if (brand) metrics.viewsByBrand[brand] = (metrics.viewsByBrand[brand] || 0) + 1;
    } else if (eventType === 'purchase') {
        if (product) metrics.purchasesByProduct[product] = (metrics.purchasesByProduct[product] || 0) + 1;
    }

    const growth = (((metrics.visits - metrics.previousVisits) / metrics.previousVisits) * 100).toFixed(2);

    // Envia a atualização em tempo real
    io.emit('metrics_update', { metrics, growth });
    res.status(200).send({ success: true });
});

// O Back4App exige que a porta seja definida pelas variáveis de ambiente
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});