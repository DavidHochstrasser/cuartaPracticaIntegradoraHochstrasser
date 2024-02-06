import { CartService } from "../services/carts.mongo.dao.js";

const cartService = new CartService();

export class CartController {
  async getCarts() {
    try {
      return await cartService.getCarts();
    } catch (err) {
      return err.message;
    }
  }

  async addCart(cart) {
    try {
      return await cartService.addCart(cart);
    } catch (err) {
      return err.message;
    }
  }

  async getCart(id) {
    try {
      return await cartService.getCart(id);
    } catch (err) {
      return err.message;
    }
  }

  async updateCart(id, newContent) {
    try {
      return await cartService.updateCart(id, newContent);
    } catch (err) {
      return err.message;
    }
  }

  async deleteCart(cid) {
    try {
      return await cartService.deleteCart(cid);
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
