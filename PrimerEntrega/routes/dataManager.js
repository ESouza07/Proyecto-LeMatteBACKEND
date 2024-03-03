const fs = require('fs');

// Rutas de los archivos de productos y carritos
const productsFilePath = 'data/products.json';
const cartsFilePath = 'data/carts.json';

// Función para cargar productos desde el archivo
const loadProducts = (req, res, next) => {
    try {
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        req.products = JSON.parse(data);
        next();
    } catch (err) {
        console.error('Error loading products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Función para guardar productos en el archivo
const saveProducts = (products) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error saving products:', err);
    }
};

// Función para cargar carritos desde el archivo
const loadCarts = (req, res, next) => {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf-8');
        req.carts = JSON.parse(data);
        next();
    } catch (err) {
        console.error('Error loading carts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Función para guardar carritos en el archivo
const saveCarts = (carts) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error saving carts:', err);
    }
};

module.exports = { loadProducts, saveProducts, loadCarts, saveCarts };



