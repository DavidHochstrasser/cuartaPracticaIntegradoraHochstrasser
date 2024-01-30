import fs from "fs";

class ProductManager {
  static id = 0;
  constructor() {
    this.path = "./productos.json";
    this.products = [];
  }

  async addProduct(product) {
    ProductManager.id++;
    const newProduct = {
      ...product,
      id: ProductManager.id,
    };
    this.products.push(newProduct);
    this.writeProducts();
    return newProduct;
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.path, "utf8");
    this.products = JSON.parse(data);
    return this.products;
  }

  async getProductsById(id) {
    const product = this.products.find((prod) => prod.id === id);
    if (product) {
      return product;
    } else {
      throw new Error("Product not found");
    }
  }

  async updateProduct(id, newData) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((item) => item.id === id);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        ...newData,
      };
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log(`Producto con id ${id} actualizado.`);
    } else {
      console.log(`No se encontró ningún producto con el id ${id}.`);
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((item) => item.id != id);

    if (products.length === filteredProducts.length) {
      console.log(`No se encontro producto con el ID ${id}`);
      return;
    }

    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts));
    console.log(`Producto con ID ${id} eliminado`);
  }

  async writeProducts() {
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
  }
}

const manager1 = new ProductManager("./productos.json");

export default ProductManager;
