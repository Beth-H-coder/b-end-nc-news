const express = require("express");
const app = express();

app.use(express.json());
const { getTopics, getArticleById } = require("./controllers/controllers");
const { handleInvalidPaths, serverErrors } = require("./controllers/errors");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.use("*", handleInvalidPaths);

// app.use((err, req, res, next) => {
//   console.log(err);
//   res.status(500).send("internal server error");
// });
app.use(serverErrors);
module.exports = app;
