const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    fullName: { tyep: String, require: true },
    phone: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
