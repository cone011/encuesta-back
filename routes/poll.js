const express = require("express");
const router = express.Router();
const { param, check, body, query } = require("express-validator");
const poll = require("../controllers/poll");
const Poll = require("../models/poll");
const isAuth = require("../middleware/isAuth");

router.get(
  "/poll",
  isAuth,
  [
    query("currentPage", "Please at least select a page").isNumeric(),
    query(
      "perPage",
      "Please at least a amount of registration per page"
    ).isNumeric(),
  ],
  poll.getAllPolls
);

router.get(
  "/poll/:pollId",
  isAuth,
  [
    param("pollId", "Please select a poll to do this action")
      .trim()
      .isLength({ min: 1 }),
  ],
  poll.getPollById
);

router.post(
  "/poll",
  isAuth,
  [
    body("name", "Please enter a name for the poll")
      .trim()
      .isLength({ min: 3 }),
    body("description", "Please enter a description for the poll")
      .trim()
      .isLength({ min: 5 }),
  ],
  poll.insertPoll
);

router.put(
  "/poll/:pollId",
  isAuth,
  [
    param("pollId", "Please select a poll to do this action")
      .trim()
      .isLength({ min: 1 }),
    body("name", "Please enter a name for the poll")
      .trim()
      .isLength({ min: 3 }),
    body("description", "Please enter a description for the poll")
      .trim()
      .isLength({ min: 5 }),
  ],
  poll.updatePoll
);

router.delete(
  "/poll/:pollId",
  isAuth,
  [
    check("pollId", "Please select a poll to do this action")
      .trim()
      .custom(async (value, { req }) => {
        const pollItem = await Poll.findById(value);
        if (!pollItem) {
          throw new Error("This poll is no longer avaible");
        }
        return true;
      }),
  ],
  poll.deletePoll
);

module.exports = router;
