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

exports.updateArticleById = (totalVotes, article_Id) => {
  console.log(totalVotes);
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [
      totalVotes,
      article_Id,
    ])
    .then((result) => {
      return result.rows[0];
    });
};
