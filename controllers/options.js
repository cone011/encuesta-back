const Options = require("../models/options");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { errorHandler } = require("../utils/errorHandler");
const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");

exports.getAllQuestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const perPage = req.query.perPage;
    const currentPage = req.query.currentPage || 1;
    const totalQuestions = await Options.find().count();
    const options = await Options.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "OK",
      totalOption: totalOption,
      options: options,
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const optionId = req.params.optionId;
    const optionItem = await Options.findById(optionId);
    res.status(200).json({
      message: "OK",
      item: optionItem,
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.insertQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const optionId = req.params.optionId;
    await Options.findByIdAndDelete(optionId);
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
