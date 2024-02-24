class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1; // ID autoincrementable
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        // Validar que el código no esté repetido
        if (this.products.some(product => product.code === code)) {
            console.error("Ya existe un producto con este código.");
            return;
        }

        // Agregar el producto con un ID autoincrementable
        const product = {
            id: this.nextId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(product);
        console.log("Producto agregado correctamente:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

// Ejemplo de uso:
const manager = new ProductManager();
manager.addProduct("Camisa", "Camisa de algodón", 20, "camisa.jpg", "CAM001", 100);
manager.addProduct("Pantalón", "Pantalón vaquero", 30, "pantalon.jpg", "PAN001", 50);

console.log(manager.getProducts());
console.log(manager.getProductById(1));
console.log(manager.getProductById(3)); // Producto no encontrado
