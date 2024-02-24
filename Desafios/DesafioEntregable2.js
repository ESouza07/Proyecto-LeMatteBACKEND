const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        try {
            let products = await this.getProductsFromFile();
            product.id = this.generateNextId(products);
            products.push(product);
            await this.saveProductsToFile(products);
            console.log("Producto agregado correctamente:", product);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }    

    async getProducts() {
        try {
            const products = await this.getProductsFromFile();
            return products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProductsFromFile();
            const product = products.find(product => product.id === id);
            if (product) {
                return product;
            } else {
                console.error("Producto no encontrado.");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.getProductsFromFile();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await this.saveProductsToFile(products);
                console.log("Producto actualizado correctamente:", products[index]);
            } else {
                console.error("Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProductsFromFile();
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                const deletedProduct = products.splice(index, 1)[0];
                await this.saveProductsToFile(products);
                console.log("Producto eliminado correctamente:", deletedProduct);
            } else {
                console.error("Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    async getProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // El archivo no existe, retornamos un arreglo vacío
                return [];
            } else {
                throw error;
            }
        }
    }

    async saveProductsToFile(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log("Productos guardados correctamente en el archivo.");
        } catch (error) {
            console.error("Error al guardar los productos en el archivo:", error);
        }
    }
    

    generateNextId(products) {
        const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
        return maxId + 1;
    }
}

// Ejemplo de uso:
const productManager = new ProductManager('products.json');

// Agregar un producto
productManager.addProduct({
    title: "Camisa",
    description: "Camisa de algodón",
    price: 20,
    thumbnail: "camisa.jpg",
    code: "CAM001",
    stock: 100
});

// Obtener todos los productos
productManager.getProducts().then(console.log);

// Obtener un producto por su id
productManager.getProductById(1).then(console.log);

// Actualizar un producto
productManager.updateProduct(1, { price: 25 }).then(() => {
    return productManager.getProductById(1);
}).then(console.log);

// Eliminar un producto
productManager.deleteProduct(1).then(() => {
    return productManager.getProducts();
}).then(console.log);
