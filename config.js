require("dotenv").config();

module.exports = {
  secretKey: process.env.SECRET_KEY,
  mongoUrl: process.env.DATABASE_URL,
  port: process.env.PORT,
  data_url: process.env.DATA_URL,
};
