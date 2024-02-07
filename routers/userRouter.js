const express = require("express");
const {
  userLogin,
  userTransactions,
  withdrawOrDepositCash,
} = require("../controller/userController");
const accessToken = require("../middleware/accessToken");

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/allTransaction").get(accessToken, userTransactions);
router.route("/withdrawOrDepositCash").post(accessToken, withdrawOrDepositCash);

module.exports = router;
