import productModel from "../models/product.model.js"; //No es necesario importar mongoose porque ya lo importamos en product.model;

class ProductManager {
  constructor() {}

  async addProduct() {
    try {
      await productModel.create();
      return "Producto agregado";
    } catch (err) {
      return err.message;
    }
  }

  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (err) {
      return err.message;
    }
  }

  async getProductsAggregate(code) {
    try {
      const products = await productModel.aggregate([
        { $match: { code: code } },
        { $sort: { price: 1 } },
      ]);
      return products;
    } catch (err) {
      return err.message;
    }
  }

  async getProductsPaginated(page, limit, code) {
    try {
      const query = code ? { code: code } : {};
      return await productModel.paginate(query, {
        offset: page,
        limit: limit,
        lean: true,
      });
    } catch (err) {
      return { status: "ERR", data: err.message };
    }
  }

  async getProduct(id) {
    try {
      const product = await productModel.findById(id);
      return product === null ? "No se encuentra el producto" : product;
    } catch (err) {
      return err.message;
    }
  }

  async updateProduct(id, newContent) {
    try {
      const procedure = await productModel.findByIdAndUpdate(id, newContent);
      return procedure;
    } catch (err) {
      return err.message;
    }
  }

  async deleteProduct(id) {
    try {
      const procedure = await productModel.findByIdAndDelete(id);
      return procedure;
    } catch (err) {
      return err.message;
    }
  }
}
export default ProductManager;
