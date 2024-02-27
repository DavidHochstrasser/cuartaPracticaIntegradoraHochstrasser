import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { authToken } from "../utils.js";
import cartsModel from "../models/carts.model.js";

const router = Router();
const manager = new CartController();

router.post("/", async (req, res) => {
  const newCart = req.body;
  res.status(200).send({ status: "Ok", data: await manager.addCart(newCart) });
});

router.get("/", authToken, async (req, res) => {
  try {
    res.status(200).send({ status: "OK", data: await manager.getCarts() });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/:cid/purchase", authToken, async (req, res) => {
  try {
    res.status(200).send({
      status: "OK",
      data: await manager.processPurchase(req.params.cid),
    });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});
//Revisar este endpoint
router.get("/tickets", authToken, async (req, res) => {
  res.status(200).send({ status: "OK", data: await manager.getTickets() });
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    console.log("cid:", cid);
    console.log("pid:", pid);
    const deleteProductInCart = await manager.getCartAndDeleteProduct(cid, pid);
    res.status(200).send({ status: "OK", data: deleteProductInCart });
  } catch (err) {
    res.status(500).send({ status: "Error", error: err.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { pid } = req.params;
    const productUpdateInCart = await manager.updateCart(cid, pid);
    res.status(200).send({ status: "OK", data: productUpdateInCart });
  } catch (err) {
    res.status(500).send({ status: "Error", error: err.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const deleteCart = await manager.deleteCart(cid);
    res.status(200).send({ status: "OK", data: deleteCart });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.put("/:cid", async (req, res) => {
  const cid = req.params;
  const { title, description, price, thumbnail, code, stock } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock) {
    return res
      .status(400)
      .send({ status: "ERR", data: "Faltan campos obligatorios" });
  }
  const data = await manager.updateCart({ _id: cid }, req.body);
  res.status(200).send({ status: "OK", data: data });
});

export default router;
