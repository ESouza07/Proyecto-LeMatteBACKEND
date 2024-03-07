const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { loadProducts, saveProducts } = require('../routes/dataManager');

const router = express.Router();

// Ruta para obtener todos los productos, con opción de limitar la cantidad
router.get('/', loadProducts, (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    let products = req.products;
    if (limit) {
        products = products.slice(0, limit);
    }
    res.json(products);
});

// Ruta para obtener un producto por su ID
router.get('/:pid', loadProducts, (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = req.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Ruta para agregar un nuevo producto
router.post('/', loadProducts, (req, res) => {
    const newProduct = req.body;
    const existingProduct = req.products.find(p => p.code === newProduct.code); // Verificar si el código ya existe
    if (existingProduct) {
        return res.status(400).json({ error: 'Product code already exists' }); // Devolver error si el código ya existe
    }
    newProduct.id = uuidv4();
    req.products.push(newProduct);
    saveProducts(req.products);
    res.status(201).json(newProduct);
});


// Ruta para actualizar un producto por su ID
router.put('/:pid', loadProducts, (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    let productIndex = req.products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    req.products[productIndex] = { ...req.products[productIndex], ...updatedProduct };
    saveProducts(req.products);
    res.json(req.products[productIndex]);
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', loadProducts, (req, res) => {
    const productId = req.params.pid;
    const initialLength = req.products.length;
    req.products = req.products.filter(p => p.id !== productId);
    if (initialLength === req.products.length) {
        return res.status(404).json({ error: 'Product not found' });
    }
    saveProducts(req.products);
    res.status(200).send('Product deleted successfully.'); // Mensaje de éxito al eliminar el producto
});


module.exports = router;

