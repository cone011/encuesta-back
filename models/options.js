const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema(
  {
    pollId: { type: Schema.Types.ObjectId, require: true },
    name: { type: String, require: true },
    count: { type: Schema.Types.Decimal128, require: false, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("options", optionSchema);
