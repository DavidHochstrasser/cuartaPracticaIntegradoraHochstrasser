import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import passport from "passport";

import { __dirname } from "./utils.js";
import usersRouter from "./routes/users.routes.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import cookiesRouter from "./routes/cookies.routes.js";
import sessionRouter from "./routes/auth.routes.js";
import MongoSingleton from "./services/mongo.singleton.js";
import errorsDictionary from "./services/error.dictionary.js";

import config from "./config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secretKeyAbc123"));

const fileStorage = FileStore(session);
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      mongoOptions: {},
      ttl: 60,
      clearInterval: 5000,
    }),
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/cookies", cookiesRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", usersRouter);

app.use("/static", express.static(`${__dirname}/public`));

try {
  // MongoSingleton.getInstance();
  const server = app.listen(config.port, () => {
    console.log(
      `Backend activo ${config.MODE} conectado a base de datos pid ${process.pid}`
    );
    app.use((err, req, res, next) => {
      const code = err.code || 500;
      const message = err.message || "Hubo un problema, error desconocido";

      return res.status(code).send({
        status: "ERR",
        data: message,
      });
    });

    app.all("*", (req, res, next) => {
      res
        .status(404)
        .send({ status: "ERR", data: errorsDictionary.PAGE_NOT_FOUND.message });
    });
  });
} catch (err) {
  console.log(`No se puede conectar con base de datos (${err.message})`);
}
