const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { loadProducts, saveProducts } = require('../routes/dataManager');

const router = express.Router();

module.exports = (io) => {
    router.get('/', loadProducts, (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        let products = req.products;
        if (limit) {
            products = products.slice(0, limit);
        }
        res.json(products);
    });

    router.post('/', loadProducts, (req, res) => {
        const newProduct = req.body;
        const existingProduct = req.products.find(p => p.code === newProduct.code);
        if (existingProduct) {
            return res.status(400).json({ error: 'Product code already exists' });
        }
        newProduct.id = uuidv4();
        req.products.push(newProduct);
        saveProducts(req.products);
        io.emit('productAdded', newProduct);
        res.status(201).json(newProduct);
    });

    router.delete('/:pid', loadProducts, (req, res) => {
        const productId = req.params.pid;
        const initialLength = req.products.length;
        req.products = req.products.filter(p => p.id !== productId);
        if (initialLength === req.products.length) {
            return res.status(404).json({ error: 'Product not found' });
        }
        saveProducts(req.products);
        io.emit('productDeleted', productId);
        res.status(200).send('Product deleted successfully.');
    });

    return router;
};