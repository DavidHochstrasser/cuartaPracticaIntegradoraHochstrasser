import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "users";

const schema = new mongoose.Schema({
  first_name: { type: String, required: false, index: true },
  last_name: { type: String, required: false },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  // cart: { type: mongoose.Schema.Types.ObjectId },
  // role: { type: String, enum: ["user", "premium", "admin"], default: "user" },
});

schema.plugin(mongoosePaginate);

export default mongoose.model(collection, schema);
