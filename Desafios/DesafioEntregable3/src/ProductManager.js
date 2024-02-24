const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []; // Si el archivo no existe, devolver un array vacío
            } else {
                throw error;
            }
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }
}

module.exports = ProductManager;
