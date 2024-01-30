import cartModel from "../models/carts.model.js";
import productModel from "../models/product.model.js";

export class CartManager {
  constructor() {}

  async getCarts() {
    try {
      const carts = await cartModel.find().lean();
      // const carts = await cartModel.aggregate([
      //   { $match: { code: "Nuevo" } },
      //
      // ]);
      return carts;
    } catch (err) {
      return err.message;
    }
  }

  async addCart(cart) {
    try {
      await cartModel.create(cart);
      return "Producto agregado al carrito";
    } catch (err) {
      return err.message;
    }
  }

  async getCart(id) {
    try {
      const cart = await cartModel.findById(id);
      return product === null ? "No se encuentra el producto" : cart;
    } catch (err) {
      return err.message;
    }
  }

  async updateCart(id, newContent) {
    try {
      const procedure = await cartModel.findByIdAndUpdate(id, newContent);
      return procedure;
    } catch (err) {
      return err.message;
    }
  }

  async deleteCart(cid) {
    try {
      const procedure = await cartModel.findByIdAndDelete(cid);
      return procedure;
    } catch (err) {
      return err.message;
    }
  }

  async getCartAndDeleteProduct(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error("No se encuentra el carrito");
      }
      const productIndex = cart.products.indexOf(pid);
      if (productIndex === -1) {
        throw new Error("No se encuentra el producto en el carrito");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return { status: "OK", data: `Producto ${pid} eliminado del carrito` };
    } catch (err) {
      return { status: "Error", error: err.message };
    }
  }

  // async getCartAndDeleteProduct(cid, pid) {
  //   try {
  //     const cart = await cartModel.findById(cid);
  //     if (!cart) {
  //       throw new Error("No se encuentra el cart");
  //     }
  //     const productInCart = await productModel.findByIdAndDelete(pid);
  //     if (!productInCart) {
  //       throw new Error("No se encuentra el product");
  //     }
  //     return productInCart;
  //   } catch (err) {
  //     return err.message;
  //   }
  // }

  async getProduct(id) {
    try {
      const product = await productModel.findById(id);
      return product === null ? "No se encuentra el producto" : product;
    } catch (err) {
      return err.message;
    }
  }
  //revisar esta funcion
  async checkStock(cid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        throw new Error("No se encuentra el carrito");
      }
      const productIndex = cart.products.indexOf(stock);
      if (productIndex === -1) {
        throw new Error("No se encuentra disponible el producto en stock");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return { status: "OK", data: `Producto ${pid} eliminado del carrito` };
    } catch (err) {
      return { status: "Error", error: err.message };
    }
  }
}
