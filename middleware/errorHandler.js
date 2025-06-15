function errorHandler(err, req, res, _next) {
  const statusCode =
    res.statusCode !== 200 ? res.statusCode : err.statusCode || 500;

  res.status(statusCode).json({
    statusCode,
    message: err.message || "Internal Server Error",
    // Include stack in dev only
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
