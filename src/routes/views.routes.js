import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { CartController } from "../controllers/cart.controller.js";
import UserController from "../controllers/user.controller.js";

const router = Router();
const manager = new ProductController();
const manager1 = new CartController();
const manager2 = new UserController();

router.get("/products", async (req, res) => {
  if (req.session.user) {
    const products = await manager.getProducts();
    res.render("products", {
      title: "Listado de Productos",
      products: products,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/users", async (req, res) => {
  if (req.session.user && req.session.user.admin === true) {
    const data = await manager2.getUsersPaginated(
      req.query.page || 1,
      req.query.limit || 50
    );

    data.pages = [];
    for (let i = 1; i <= data.totalPages; i++) data.pages.push(i);

    res.render("users", {
      title: "Listado de USUARIOS",
      data: data,
    });
  } else if (req.session.user) {
    // Si hay un usuario logueado pero no es admin
    res.redirect("/profile");
  } else {
    // caso contrario volvemos al login
    res.redirect("/login");
  }
});

router.get("/carts", async (req, res) => {
  const carts = await manager1.getCarts();
  res.render("carts", {
    title: "Carrito",
    products: carts,
  });
});

router.get("/cookies", async (req, res) => {
  res.render("cookies", {});
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/profile");
  } else {
    res.render("login", {});
  }
});

router.get("/profile", async (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/register", async (req, res) => {
  res.render("register", {});
});

export default router;
