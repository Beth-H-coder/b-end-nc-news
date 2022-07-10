const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectUsers,
  fetchArticleByIdWithComms,
  fetchArticles,
  fetchComments,
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
  const newVotes = req.body.inc_votes; //|| 0;
  updateArticleById(newVotes, article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByIdWithComms = (req, res, next) => {
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

  fetchArticleByIdWithComms(article_id);
  console
    .log("in controller 2")
    .then((article) => {
      console.log("in contrller 3");
      if (article) {
        console.log(article);
        res.status(200).send({ article: article });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;

  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article) {
        next;
      } else {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    })
    .catch((err) => {
      next(err);
    });

  fetchComments(article_id)
    .then((comments) => {
      if (comments) {
        res.status(200).send(comments);
      }
    })
    .catch((err) => {
      next(err);
    });
};
