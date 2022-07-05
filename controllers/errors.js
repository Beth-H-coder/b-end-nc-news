exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "invalid path" });
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
