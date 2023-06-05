const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const dotevn = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
dotevn.config();

const MONGODB_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5050;

const user = require("./routes/users");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

app.use("/api", user);

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    const serverPort = app.listen(PORT);
    const io = require("./socket/socket").init(serverPort);
    io.on("connection", (socket) => {});
  })
  .catch((err) => {
    console.log(err);
  });
