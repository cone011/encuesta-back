const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pollSchema = new Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: false },
    options: [{ type: Schema.Types.ObjectId, ref: "options", require: true }],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    lastUser: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("poll", pollSchema);
