const User = require("../models/users.model");

async function accessToken(req, res, next) {
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
        message: "Authorization Failed!!!",
      });
    }

    var user = await User.findOne({
      where: {
        token: token,
      },
    });

    if (!user) {
      return res.send({
        status: false,
        message: "Authorization Failed!!!",
      });
    }

    const isValidToken = await user.isValidToken(token);
    if (!isValidToken) {
      return res.send({
        status: false,
        message: "Authorization Failed!!!",
      });
    }

    req.user_id = user.user_id;
    req.email = user.email;
    req.username = user.username;
    req.role = user.role;
    next();
  } catch (error) {
    console.error("accessToken error:", error);
    return res.send({
      status: false,
      message: "Authorization Failed!!!",
    });
  }
}

module.exports = accessToken;
