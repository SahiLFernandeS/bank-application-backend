const User = require("../models/users.model");

async function bankerAccessToken(req, res, next) {
  try {
    var token;
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.send({
        status: false,
        message: "Banker authorization Failed!!!",
      });
    }

    var user = await User.findOne({
      where: {
        token: token,
        role: "banker",
      },
    });

    if (!user) {
      return res.send({
        status: false,
        message: "Banker authorization Failed!!!",
      });
    }

    const isValidToken = await user.isValidToken(token);
    if (!isValidToken) {
      return res.send({
        status: false,
        message: "Banker authorization Failed!!!",
      });
    }

    next();
  } catch (error) {
    console.error("bankerAccessToken error:", error);
    return res.send({
      status: false,
      message: "Banker authorization Failed!!!",
    });
  }
}

module.exports = bankerAccessToken;
