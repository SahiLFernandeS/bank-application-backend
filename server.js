const express = require("express");
const userRouter = require("./routers/userRouter");
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const bankRouter = require("./routers/bankRouter");
require("dotenv").config();

function main() {
  (async function () {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })();

  const app = express();

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(bodyParser.json());
  express.urlencoded({ extended: false });

  app.use("/users", userRouter);
  app.use("/bankers", bankRouter);

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`LISTENING ON PORT: ${PORT}`);
  });
}

main();
