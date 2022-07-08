const express = require("express");
const app = express();

app.use(express.json());

const {
  getTopics,
  getArticleById,
  patchArticleById,
  getUsers,
  // getArticles,
} = require("./controllers/controllers");

const {
  handleCustomErrors,
  handleInvalidPaths,
  handleServerErrors,
  handlePsqlErrors,
} = require("./controllers/errors");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
//app.get("/api/articles", getArticles);

app.patch("/api/articles/:article_id", patchArticleById);

app.use("*", handleInvalidPaths);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
