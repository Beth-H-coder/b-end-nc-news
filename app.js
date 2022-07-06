const express = require("express");
const app = express();

app.use(express.json());
const {
  getTopics,
  getArticleById,

} = require("./controllers/controllers");
const {
  handleInvalidPaths,
  handleServerErrors,
  handlePsqlErrors,
} = require("./controllers/errors");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use("*", handleInvalidPaths);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
