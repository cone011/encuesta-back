const Questions = require("../models/questions");
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
    const totalQuestions = await Questions.find().count();
    const questions = await Questions.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "OK",
      totalQuestions: totalQuestions,
      questions: questions,
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.getQuestionById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const questionsId = req.params.questionsId;
    const questionItem = await Questions.findById(questionsId);
    res.status(200).json({
      message: "OK",
      item: questionItem,
    });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const questionsId = req.params.questionsId;
    await Questions.findByIdAndDelete(questionsId);
    res.status(200).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
