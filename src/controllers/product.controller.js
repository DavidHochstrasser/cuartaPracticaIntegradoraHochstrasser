import { ProductService } from "../services/products.mongo.dao.js";

class ProductDTO {
  constructor(product) {
    this.product = product;
    this.product.title = this.product.title.toUpperCase();
  }
}

const productService = new ProductService();

export default class ProductController {
  constructor() {}

  async addProduct(product) {
    try {
      const normalizedProduct = new ProductDTO(product);
      await productService.addProduct(normalizedProduct);
    } catch (err) {
      return err.message;
    }
  }

  async getProducts() {
    try {
      return await productService.getProducts();
    } catch (err) {
      return err.message;
    }
  }

  async getProductsAggregate(code) {
    try {
      return await productService.getProductsAggregate(code);
    } catch (err) {
      return err.message;
    }
  }

  async getProductsPaginated(page, limit, code) {
    try {
      return await productService.getProductsPaginated(page, limit, code);
    } catch (err) {
      return { status: "ERR", data: err.message };
    }
  }

  async getProduct(id) {
    try {
      return await productService.getProduct(id);
    } catch (err) {
      return err.message;
    }
  }

  async updateProduct(id, newContent) {
    try {
      return await productService.updateProduct(id, newContent);
    } catch (err) {
      return err.message;
    }
  }

  async deleteProduct(id) {
    try {
      return await productService.deleteProduct(id);
    } catch (err) {
      return err.message;
    }
  }
}
