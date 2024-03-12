const express = require('express');
const exphbs = require('express-handlebars').create({ /* configuración opcional */ });
const http = require('http');
const socketIo = require('socket.io');
const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Inicializar el servidor de sockets

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');

// Middleware para manejar archivos estáticos
app.use(express.static('public'));

// Middleware para el manejo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const productRoutes = require('./routes/products')(io); // Pasar el objeto io como argumento
const cartRoutes = require('./routes/carts');
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para /realTimeProducts
app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', { products: [] }); // Renderizar la vista realTimeProducts.handlebars
});

// Inicialización del servidor de sockets
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Manejar la adición de productos
    socket.on('addProduct', (product) => {
        console.log('Product added:', product);
        io.emit('productAdded', product);
    });

    // Manejar la eliminación de productos
    socket.on('deleteProduct', (productId) => {
        console.log('Product deleted:', productId);
        io.emit('productDeleted', productId);
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


