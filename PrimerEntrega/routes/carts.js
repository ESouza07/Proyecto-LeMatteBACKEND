const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { loadCarts, saveCarts, loadProducts } = require('../routes/dataManager');

const router = express.Router();

// Ruta para obtener todos los carritos
router.get('/', loadCarts, (req, res) => {
    res.json(req.carts);
});

// Ruta para crear un nuevo carrito
router.post('/', loadCarts, (req, res) => {
    const newCart = { id: uuidv4(), products: [] };
    req.carts.push(newCart);
    saveCarts(req.carts);
    res.status(201).json(newCart);
});

// Ruta para obtener un carrito por su ID
router.get('/:cid', loadCarts, (req, res) => {
    const cartId = req.params.cid;
    const cart = req.carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', loadCarts, loadProducts, (req, res) => {
    const { cid, pid } = req.params;
    const cart = req.carts.find(c => c.id === cid);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    const product = req.products.find(p => p.id === pid);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const existingProduct = cart.products.find(p => p.id === pid);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.products.push({ id: pid, quantity: 1 });
    }
    saveCarts(req.carts);
    res.status(201).json(cart);
});

module.exports = router;




