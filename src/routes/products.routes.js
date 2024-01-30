import { Router } from "express";
import uploader from "../uploader.js";
import ProductManager from "../controllers/product.manager.mdb.js";
import productModel from "../models/product.model.js";

const router = Router();
const manager = new ProductManager();

// router.get("/", async (req, res) => {
//   const products = await manager.getProducts();
//   res.status(200).send({ status: "OK", data: products });
// });

// router.get("/", async (req, res) => {
//   const products = await productModel.find();
//   res.status(200).send({ status: "Todo OK", data: products });
// });

router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const code = req.query.code;

    if (code) {
      const data = await manager.getProductsPaginated(page, limit, code);
      res.status(200).send({ status: "OK", data: data });
    } else {
      const products = await manager.getProductsPaginated(page, limit);
      res.status(200).send({ status: "OK", data: products });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .send({ status: "FIL", data: "No se pudo subir el archivo" });
  const { title, description, price, code, stock } = req.body;
  if (!title || !description || !price || !code || !stock) {
    return res
      .status(400)
      .send({ status: "ERR", data: "Faltan campos obligatorios" });
  }
  const newContent = {
    title,
    description,
    price,
    thumbnail: req.file.filename,
    code,
    stock,
  };
  const result = await manager.addProduct(newContent);
  res.status(200).send({ status: "OK", data: result });
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnail, code, stock } = req.body;
  if (!title || !description || !price || !thumbnail || !code || !stock) {
    return res
      .status(400)
      .send({ status: "ERR", data: "Faltan campos obligatorios" });
  }
  const result = await manager.updateProduct({ _id: pid }, req.body);
  res.status(200).send({ status: "OK", data: result });
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const result = await productModel.deleteOne({ _id: pid });
  res.status(200).send({ status: "OK", data: result });
});

export default router;
