const {
  selectTopics,
  selectArticleById,
  updateArticleById,
} = require("../models/models");

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

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  selectArticleById(article_id)
    .then((article) => {
      if (article) {
        return article.votes;
      } else {
        return res.status(404).send({ msg: "Article not found" });
      }
    })
    .catch((err) => {
      next(err);
    })
    .then((votes) => {
      let totalVotes = votes + inc_votes;
      updateArticleById(totalVotes, article_id)
        .then((updatedArticle) => {
          res.status(200).send({ article: updatedArticle });
        })
        .catch((err) => {
          next(err);
        });
    });
};
