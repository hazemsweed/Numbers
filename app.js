// app.js  – polished one-stop server file

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const mongoose = require("mongoose");

const config = require("./config");
const corsConfig = require("./middleware/cors");
const limiter = require("./middleware/limiter");
const errorHandler = require("./middleware/errorHandler");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const numbersRouter = require("./routes/numbersRouter");

//  MongoDB
mongoose
  .connect(config.mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo connection error:", err));

// Express app
const app = express();

// Security & general middleware
app.use(helmet());
app.use(corsConfig.corsWithOptions);
app.use(limiter);
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(passport.initialize());

// Views & static assets
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/numbers", numbersRouter);

// 404 & error handler (must be last)
app.use((req, _res, next) => next(createError(404)));
app.use(errorHandler);

// Server bootstrap (only if run directly)
if (require.main === module) {
  require("http")
    .createServer(app)
    .listen(config.port, () =>
      console.log(`Server listening on port ${config.port}`)
    );
}

module.exports = app;
