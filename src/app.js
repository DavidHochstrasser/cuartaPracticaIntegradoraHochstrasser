import express from "express";
import mongoose from "mongoose";
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
import sessionRouter from "./routes/session.routes.js";

// import config from "./config.js";

const PORT = 8080;
const MONGOOSE_URL =
  "mongodb+srv://coder_55605:Balcon580@cluster0.ndlarik.mongodb.net/ecommerce";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("secretKeyAbc123"));

const fileStorage = FileStore(session);
app.use(
  session({
    // store: new fileStorage({ path: "./sessions", ttl: 60, retries: 0 }),1
    store: MongoStore.create({
      mongoUrl: MONGOOSE_URL,
      mongoOptions: {},
      ttl: 60,
      clearInterval: 5000,
    }),
    secret: "secretkeyabc132",
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
  await mongoose.connect(MONGOOSE_URL);
  const server = app.listen(PORT, () => {
    console.log(`Backend activo ${PORT} conectado a base de datos`);
  });
} catch (err) {
  console.log(`No se puede conectar con base de datos (${err.message})`);
}
