const {
  selectTopics,
  selectArticleById,
  updateArticleById,
  selectUsers,
  //selectArticles,
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

// exports.getArticles = (req, res, next) => {
//   console.log(req);
//   const { sort_by } = req.query;
//   const { order_by } = req.query;
//   console.log(sort_by);
//   console.log(order_by);
//   selectArticles()
//     .then((articles) => {
//       console.log(articles);
//       res.status(200).send({ articles });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
