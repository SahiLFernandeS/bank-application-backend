const crypto = require("crypto");

const generateAccessToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(18, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString("hex");
        resolve(token);
      }
    });
  });
};

module.exports = generateAccessToken;
