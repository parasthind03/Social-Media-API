module.exports = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong!'
    });
  }
};
