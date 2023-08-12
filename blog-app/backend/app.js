const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");

// routes
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

// utils
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

const connectToDb = async function () {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
  }
};
connectToDb();

// if (config.MONGODB_URI && !mongoose.connection.readyState)
//   mongoose.connect(config.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use(middleware.errorHandler);

module.exports = app;
