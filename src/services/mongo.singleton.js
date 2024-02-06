import mongoose from "mongoose";
import config from "../config.js";

export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(config.mongoUrl);
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      console.log("Conexión DB creada");
    } else {
      console.log("Conexión DB recuperada");
    }
    return this.#instance;
  }
}
