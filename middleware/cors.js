const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = ["https://stayoverseaz.com", "http://localhost:4200"];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;

  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);

exports.whitelist = whitelist;
