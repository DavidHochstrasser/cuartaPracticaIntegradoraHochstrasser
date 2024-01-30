import { Router } from "express";

const router = Router();

router.get("/getcookies", async (req, res) => {
  try {
    // res.status(200).send({ status: "OK", data: req.cookies });
    res.status(200).send({ status: "OK", data: req.signedCookies });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});
router.get("/setcookies", async (req, res) => {
  try {
    res.cookie("coderCookie", "Este es el contenido de la cookie firmada", {
      maxAge: 60000,
      signed: true,
    });
    res.status(200).send({ status: "OK", data: "Cookie generada" });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});
router.get("/deletecookies", async (req, res) => {
  try {
    res.clearCookie("coderCookie");
    res.status(200).send({ status: "OK", data: "Cookie eliminada" });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.cookie(
      "coderCookie",
      { user: req.body.user, email: req.body.email },
      { maxAge: 30000, signed: true }
    );
    res.status(200).send({ status: "OK", data: "Cookie generada" });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

export default router;
