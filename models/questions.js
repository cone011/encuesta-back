const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionsSchema = new Schema(
  {
    poll: { type: Schema.Types.ObjectId, require: true },
    option: { type: String, require: true },
    count: { type: Schema.Types.Decimal128, require: false, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("questions", questionsSchema);
