const expressAsyncHandler = require("express-async-handler");
const User = require("../models/users.model");
const Account = require("../models/accounts.model");

const allCustomers = expressAsyncHandler(async (req, res) => {
  try {
    let pageSize = 10;
    let page = Number(req.query.page) || 1;
    let offset = (page - 1) * pageSize;

    let allCustomerData = await User.findAndCountAll({
      where: {
        role: "customer",
      },
      attributes: { exclude: ["token", "password"] },
      limit: pageSize,
      offset: offset,
      raw: true,
    });

    let object = {
      totalPage: Math.ceil(allCustomerData.count / pageSize),
      currentPage: page,
      rows: allCustomerData.rows,
    };

    return res.send({
      status: true,
      message: "Success",
      data: object,
    });
  } catch (error) {
    console.error("allCustomers error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

const customerTransaction = expressAsyncHandler(async (req, res) => {
  try {
    var { userId } = req.params;

    if (!userId) {
      return res.send({
        status: false,
        message: "Please provide valid input",
      });
    }

    let pageSize = 10;
    let page = Number(req.query.page) || 1;
    let offset = (page - 1) * pageSize;

    var transactionData = await Account.findAndCountAll({
      where: {
        user_id: userId,
      },
      limit: pageSize,
      offset: offset,
      raw: true,
    });

    var availableBalance = await Account.findOne({
      where: {
        user_id: userId,
      },
      order: [["transaction_id", "DESC"]],
      attributes: ["amount"],
    });

    if (!availableBalance) {
      availableBalance = {};
      availableBalance.amount = 0;
    }

    let object = {
      availableBalance: availableBalance.amount,
      totalPage: Math.ceil(transactionData.count / pageSize),
      currentPage: page,
      rows: transactionData.rows,
    };

    return res.send({
      status: true,
      message: "Success",
      data: object,
    });
  } catch (error) {
    console.error("allCustomers error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});
module.exports = { allCustomers, customerTransaction };
