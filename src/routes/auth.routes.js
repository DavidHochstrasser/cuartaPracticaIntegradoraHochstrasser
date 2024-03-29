import { Router } from "express";
import passport from "passport";
import usersModel from "../models/users.model.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import initPassport from "../auth/passport.auth.js";

initPassport();
const router = Router();

const auth = (req, res, next) => {
  try {
    if (req.session.user) {
      if (req.session.user.admin === true) {
        next();
      } else {
        res.status(403).send({ status: "ERR", data: "Usuario no admin" });
      }
    } else {
      res.status(401).send({ status: "ERR", data: "Usuario no autorizado" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
};

router.get("/", async (req, res) => {
  try {
    if (req.session.visits) {
      req.session.visits++;
      res.status(200).send({
        status: "OK",
        data: "Cantidad de visitas:${req.session.visits}",
      });
    } else {
      req.session.visits = 1;
      res.status(200).send({ status: "OK", data: "Bienvenido al site" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ status: "ERR", data: err.message });
      } else {
        res.status(200).send({ status: "OK", data: "Sesión finalizada" });
      }
    });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/admin", auth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ status: "OK", data: "Estos son los datos privados" });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/hash/:pass", async (req, res) => {
  res.status(200).send({ status: "OK", data: createHash(req.params.pass) });
});

router.get("/failregister", async (req, res) => {
  res.status(400).send({
    status: "ERR",
    data: "El email ya existe o faltan datos obligatorios",
  });
});

router.get(
  "/github",
  passport.authenticate("githubAuth", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("githubAuth", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = { username: req.user.email, admin: true };
    // req.session.user = req.user;
    res.redirect("/profile");
  }
);

//hochstrasser.davi@gmail.com
//abc123

router.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const userInDb = await usersModel.findOne({ email: email });

    if (userInDb !== null && isValidPassword(userInDb, pass)) {
      // Autentificacion a traves de token JWT o sessions

      // // Utilizando tokens JWT
      // const access_token = generateToken(
      //   { username: email, role: "user" },
      //   "1h"
      // );
      // res.cookie("codertoken", access_token, {
      //   maxAge: 60 * 60 * 1000,
      //   httpOnly: true,
      // });
      // res.status(200).send({
      //   status: "OK",
      //   data: { access: "authorized", token: access_token },
      // });

      // Utilizando sessions
      if (isValidPassword(userInDb, pass)) {
        req.session.user = { username: email, admin: true };
        res.redirect("/products");
      }
    } else {
      res.status(401).send({ status: "ERR", data: "Datos no válidos" });
    }
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.post(
  "/register",
  passport.authenticate("registerAuth", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    try {
      res.status(200).send({ status: "OK", data: "Usuario registrado" });
    } catch (err) {
      res.status(500).send({ status: "ERR", data: err.message });
    }
  }
);

export default router;
