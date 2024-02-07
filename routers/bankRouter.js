const express = require("express");
const accessToken = require("../middleware/accessToken");
const {
  allCustomers,
  customerTransaction,
} = require("../controller/bankController");
const bankerAccessToken = require("../middleware/bankerAccessToken");

const router = express.Router();

router.route("/allCustomers").get(accessToken, bankerAccessToken, allCustomers);
router
  .route("/customerTransaction/:userId")
  .get(accessToken, bankerAccessToken, customerTransaction);

module.exports = router;
