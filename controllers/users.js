const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { errorHandler } = require("../utils/errorHandler");
const { validationResult } = require("express-validator");
const { validationParams } = require("../utils/validationParams");

exports.getAllUsers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const perPage = req.query.perPage;
    const currentPage = req.query.perPage || 1;
    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res
      .status(200)
      .json({ message: "OK", users: users, totalUsers: totalUsers });
  } catch (err) {
    errorHandler(res, next);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const userId = req.params.userId;
    //const userIitem = await User.findById(userId) /*Tambien puedo hacer de esta forma usando mongoose */
    const userItem = await User.find({ _id: new ObjectId(userId) }).select(
      "_id email fullNname"
    );
    res.status(200).json({ message: "OK", user: userItem });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const email = req.body.email;
    const password = req.body.password;
    const userItem = await User.findOne({ email: email });
    if (!userItem) {
      const error = new Error(
        "The user with this email are not register, please sign in!"
      );
      error.statusCode = 401;
      throw err;
    }
    const isEqual = bcrypt.compare(password, userItem.password);
    if (!isEqual) {
      const error = new Error("Invalid Password!");
      error.statusCode = 401;
      throw err;
    }
    const token = jwt.sign(
      { userId: userItem._id.toString() },
      `${process.env.JWT_TOKEN}`,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const fullName = req.body.fullNamefullName;
    const hashPwd = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashPwd,
      fullName: fullName,
      phone: phone,
    });
    const result = await user.save();
    res.status(201).json({ message: "OK", userId: result._id });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const userId = req.params.userId;
    const newPassword = req.body.newPassword;
    const hashNewPass = await bcrypt.hash(newPassword, 12);
    await User.updateOne(
      { _id: ObjectId(userId) },
      { $set: { password: hashNewPass } }
    );
    res.status(201).json({ message: "OK", userId: userId });
  } catch (err) {
    errorHandler(err, next);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    validationParams(res, errors);
    const userId = req.params.userId;
    await User.deleteOne({ _id: new ObjectId(id) });
    //await User.findByIdAndDelete(id)
    res.status(201).json({ message: "OK", isDeleted: true });
  } catch (err) {
    errorHandler(err, next);
  }
};
