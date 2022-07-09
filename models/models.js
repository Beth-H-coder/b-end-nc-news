const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_Id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_Id])
    .then((article) => {
      return article.rows[0];
    });
};

exports.updateArticleById = (newVotes, article_Id) => {
  if (newVotes === undefined) {
    return Promise.reject({
      status: 400,
      msg: `Invalid data type`,
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_Id = $2 RETURNING *`,
      [newVotes, article_Id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Article not found`,
        });
      }
      return article;
    });
};

exports.selectUsers = () => {
  const queryStr = `SELECT * FROM users`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.fetchArticles = () => {
  let articleIdQuery = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments on comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  return db.query(articleIdQuery).then((result) => {
    console.log(result.rows);

    return result.rows;
  });
};
