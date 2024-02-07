const expressAsyncHandler = require("express-async-handler");
const User = require("../models/users.model");
const { Op } = require("sequelize");
const generateAccessToken = require("../repository/generateToken");
const Account = require("../models/accounts.model");

const userLogin = expressAsyncHandler(async (req, res) => {
  try {
    var { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.send({ status: false, message: "Please provide valid input" });
    }

    const user = await User.findOne({
      where: {
        [Op.and]: [{ username }, { email }],
      },
    });

    if (!user) {
      return res.send({
        status: false,
        message: "Invalid username/email or password",
      });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.send({
        status: false,
        message: "Invalid username/email or password",
      });
    }

    var newToken = await generateAccessToken();
    await User.update(
      {
        token: newToken,
      },
      { where: { user_id: user.user_id } }
    );

    return res.send({
      status: true,
      data: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: newToken,
      },
      message: "Login Success",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

const userTransactions = expressAsyncHandler(async (req, res) => {
  try {
    let pageSize = 10;
    let page = Number(req.query.page) || 1;
    let offset = (page - 1) * pageSize;

    var transactionData = await Account.findAndCountAll({
      where: {
        user_id: req.user_id,
      },
      limit: pageSize,
      offset: offset,
      raw: true,
    });

    var availableBalance = await Account.findOne({
      where: {
        user_id: req.user_id,
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
    console.error("userTransactions error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

const withdrawOrDepositCash = expressAsyncHandler(async (req, res) => {
  try {
    var { amount, transactionType } = req.body;

    if (!amount || !transactionType) {
      return res.send({ status: false, message: "Please provide valid input" });
    }

    var previousCash = await Account.findOne({
      where: { user_id: req.user_id },
      order: [["transaction_id", "DESC"]],
      raw: true,
    });

    var newAmount;

    if (transactionType == "deposit") {
      if (!previousCash) {
        newAmount = parseFloat(amount);
      } else {
        newAmount = parseFloat(previousCash.amount) + parseFloat(amount);
      }

      let nextCash = await Account.create({
        user_id: req.user_id,
        transaction_type: "deposit",
        amount: newAmount,
      });

      return res.send({
        status: true,
        message: "Success",
        data: nextCash,
      });
    } else if (transactionType == "withdrawal") {
      if (!previousCash) {
        return {
          status: false,
          message: "Insufficient Funds",
        };
      } else {
        if (parseFloat(previousCash.amount) < parseFloat(amount)) {
          return res.send({
            status: false,
            message: "Insufficient Funds",
          });
        }
        newAmount = parseFloat(previousCash.amount) - parseFloat(amount);

        let nextCash = await Account.create({
          user_id: req.user_id,
          transaction_type: "withdrawal",
          amount: newAmount,
        });

        return res.send({
          status: true,
          message: "Success",
          data: nextCash,
        });
      }
    } else {
      return res.send({
        status: false,
        message: "Not a valid transaction type",
      });
    }
  } catch (error) {
    console.error("withdrawOrDepositCash error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
});

module.exports = {
  userLogin,
  userTransactions,
  withdrawOrDepositCash,
};
