const express = require("express");
const router = express.Router();
const { body, param, query, check } = require("express-validator");
const user = require("../controllers/users");
const isAuth = require("../middleware/isAuth");
const User = require("../models/users");

router.get(
  "/user",
  isAuth,
  [
    query(
      "perPage",
      "Please at least assign the amount of registration you wanna see in the page"
    )
      .isNumeric()
      .isLength({ min: 1 }),
    query("currentPage", "Please at least select a page")
      .isNumeric()
      .isLength({ min: 1 }),
  ],
  user.getAllUsers
);

router.get(
  "/user/:userId",
  isAuth,
  [
    param("userId", "Please at lease select a registration")
      .trim()
      .isLength({ min: 1 }),
  ],
  user.getUserById
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password", "Please enter your password").trim().isLength({ min: 5 }),
  ],
  user.login
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .custom(async (value, { req }) => {
        const userFound = await User.findOne({ email: value });
        if (userFound) {
          throw new Error(
            "Please enter a diffrent email, beacause this is already take it!"
          );
        }
      }),
    body("password", "Please enter your password").trim().isLength({ min: 5 }),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("The password do not match");
        }
      }),
    body("fullName", "Please enter a name").trim().isLength({ min: 5 }),
  ],
  user.signUp
);

router.delete(
  "/user/:userId",
  isAuth,
  [
    check("userId", "Please at lease select a registration")
      .trim()
      .custom(async (value, { req }) => {
        const userItem = await User.findById(value);
        if (!userItem) {
          throw new Error("This user is no longer exist");
        }
      }),
  ],
  user.deleteUser
);

module.exports = router;
