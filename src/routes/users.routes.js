import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import CustomError from "../services/error.custom.class.js";
import errorsDictionary from "../services/error.dictionary.js";

const router = Router();
const controller = new UserController();

router.get("/", async (req, res) => {
  try {
    const users = await controller.getUsers();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/paginated", async (req, res) => {
  try {
    const users = await controller.getUsersPaginated();
    res.status(200).send({ status: "OK", data: users });
  } catch (err) {
    res.status(500).send({ status: "ERR", data: err.message });
  }
});

router.get("/premium/:uid", async (req, res) => {});

router.post("/", async (req, res, next) => {
  const { first_name, last_name, email, gender, password } = req.body;
  if (first_name && last_name && email && gender && password) {
    return res
      .status(200)
      .send({ status: "OK", data: await controller.addUser(req.body) });
  }

  return next(new CustomError(errorsDictionary.FEW_PARAMETERS));
});

export default router;
