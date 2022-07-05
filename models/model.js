const db = require("../db/connection");

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
