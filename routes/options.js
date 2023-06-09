const express = require("express");
const router = express.Router();
const { param, body, check } = require("express-validator");
const options = require("../controllers/options");
const Options = require("../models/options");
const isAuth = require("../middleware/isAuth");

router.get("/options", isAuth, options.getAllQuestions);

router.get(
  "/options/:optionId",
  isAuth,
  [
    param("optionId", "Please at lease select a registration")
      .trim()
      .isLength({ min: 1 }),
  ],
  options.getQuestionById
);

router.delete(
  "/options/:optionId",
  isAuth,
  [
    param("optionId", "Please at lease select a registration")
      .trim()
      .check(async (value, { req }) => {
        const optionItem = await Options.findById(value);
        if (!optionItem) {
          throw new Error("This option is no longer avaiable");
        }
        return true;
      }),
  ],
  options.getQuestionById
);

module.exports = router;
