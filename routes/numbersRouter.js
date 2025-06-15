const express = require("express");
const cors = require("../middleware/cors");
const authenticate = require("../middleware/authenticate");
const axios = require("axios");
const config = require("../config");
const NumbersRouter = express.Router();

NumbersRouter.route("/")
  .options(cors.corsWithOptions, authenticate.verifyUser, (_req, res) => {
    res.sendStatus(200);
  })
  // GET /numbers
  .get(cors.corsWithOptions, async (_req, res, next) => {
    try {
      const { data } = await axios.get(config.data_url);
      if (!data) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.json(data);
    } catch (err) {
      next(err); // delegated to error-handling middleware
    }
  });

module.exports = NumbersRouter;
