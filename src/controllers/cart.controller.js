import { CartService } from "../services/carts.mongo.dao.js";
import TicketService from "../services/ticket.mongo.dao.js";

const cartService = new CartService();
const ticketService = new TicketService();

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
  async getTickets() {
    return await ticketService.getTickets();
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

  async processPurchase(cid) {
    const cart = await service.getCartById(cid);

    if (cart === null) {
      throw new CustomError({
        ...errorsDictionary.ID_NOT_FOUND,
        moreInfo: "cart",
      });
    } else {
      let total = 0;
      let cartModified = false;

      for (const item of cart.products) {
        const pid = item.pid._id;
        const qty = item.qty;
        const stock = item.pid.stock;
        const price = item.pid.price;

        if (stock > 0) {
          let newStock = 0;

          if (stock >= qty) {
            newStock = stock - qty;
            item.qty = 0;
            total += qty * price;
          } else {
            newStock = 0;
            item.qty -= stock;
            total += stock * price;
          }

          await productService.updateProduct(pid, { stock: newStock });
          cartModified = true;
        }
      }

      if (cartModified) {
        await cart.save();
        await ticketService.addTicket({
          amount: total,
          purchaser: req.user._id,
        });

        return cart;
      } else {
        return errorsDictionary.NO_TICKET_GENERATED.message;
      }
    }
  }
}
