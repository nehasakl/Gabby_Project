const createError = require("http-errors");
const express = require("express");
var httpContext = require("express-http-context");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
// const indexRouter = require("./routes/index");
const { ValidationError } = require("express-validation");
const CronJobService = require("./app/services/cronJob.service");
var cron = require('node-cron');
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");

const logDirectory = path.join(__dirname, "log");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const fileDirectory = path.join(__dirname, "uploads");
fs.existsSync(fileDirectory) || fs.mkdirSync(fileDirectory);

const app = express();
app.use(cors());
// view engine setup
app.use(httpContext.middleware);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// specify the folder for upload
// app.use("/tootter/uploads", express.static(path.join(__dirname, "/uploads/")));

// app.use(
//   "/tootter/category",
//   express.static(path.join(__dirname, "/uploads/category"))
// );
// app.use(
//   "/tootter/activity",
//   express.static(path.join(__dirname, "/uploads/activity"))
// );
// app.use(
//   "/tootter/class",
//   express.static(path.join(__dirname, "/uploads/class"))
// );
// app.use(
//   "/tootter/user",
//   express.static(path.join(__dirname, "/uploads/users"))
// );
// app.use(
//   "/tootter/story",
//   express.static(path.join(__dirname, "/uploads/story"))
// );

// app.use("/tootter", indexRouter);

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/welcome.html"));
});
//connect to mongoDB
require("./db");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.status).json(err);
  }

  return res.status(500).json(err);
});

cron.schedule('* * 1 * * *', () => {
  console.log('cron called')
  CronJobService.deleteStory();
});
module.exports = app;
