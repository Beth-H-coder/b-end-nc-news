const {
  selectTopics,
  selectArticleById,
  updateArticleById,
} = require("../models/model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article) {
        res.status(200).send({ article: article });
      } else {
        return res.status(404).send({ msg: "Article not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
