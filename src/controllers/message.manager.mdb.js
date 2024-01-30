import messageModel from "../models/message.model.js";

export class MessageManager {
  constructor() {}

  async addMessage(message) {
    console.log("message: ", message);
    try {
      await messageModel.create(message);
      return "Mensaje agregado";
    } catch (err) {
      console.log("err: ", err);
      return err.message;
    }
  }

  async getMessage() {
    try {
      const message = await messageModel.find().lean();
      return message;
    } catch (err) {
      return err.message;
    }
  }
}
