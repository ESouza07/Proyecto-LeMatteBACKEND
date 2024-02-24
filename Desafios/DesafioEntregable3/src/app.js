const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('products.json');

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); // Obtiene el valor de 'limit' de los query params
        const products = await productManager.getProducts();
        
        if (!isNaN(limit)) {
            res.json(products.slice(0, limit)); // Devuelve solo los productos hasta el límite especificado
        } else {
            res.json(products); // Devuelve todos los productos
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
