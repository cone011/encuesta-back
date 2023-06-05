const Poll = require("../models/poll");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { errorHandler } = require("../utils/errorHandler");
const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");

exports.getAllPolls = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const perPage = req.query.perPage;
    const currentPage = req.query.currentPage || 1;
    const totalPolls = await Poll.countDocuments();
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", totalPolls: totalPolls, polls: polls });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getPollById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const pollId = req.params.pollId;
    const pollItem = await Poll.findOne({ _id: new ObjectId(pollId) });
    //const itemPoll = await Poll.findById(pollId)
    res.status(200).json({ message: "OK", poll: pollItem });
  } catch (err) {
    errorHandler(err, next);
  }
};
