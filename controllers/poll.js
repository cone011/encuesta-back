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
      .select("_id name description")
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

exports.insertPoll = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const name = req.body.name;
    const description = req.body.description;
    const options = req.body.options;
    const pollItem = new Poll({
      name: name,
      description: description,
    });
    const result = await pollItem.save();
    res.status(201).json({ message: "OK", isSaved: true, pollId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.updatePoll = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const name = req.body.name;
    const description = req.body.description;
    const options = req.body.options;
    const pollId = req.params.pollId;
    const pollItem = await Poll.findById(pollId);
    if (!pollItem) {
      throw new Error("This poll is no longer avaible");
    }
    pollItem.name = name;
    pollItem.description = description;
    await pollItem.save();
    res.status(201).json({ message: "OK", isSaved: true });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deletePoll = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const pollId = req.params.pollId;
    //await Poll.deleteOne({ _id: ObjectId(pollId) });
    await Poll.findByIdAndDelete(pollId);
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
