import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "messages";

const schema = new mongoose.Schema({
  userName: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.model(collection, schema);
