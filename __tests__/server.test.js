const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index");

afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("status 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: route does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid path");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: responds with an object with all properties", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("status 404: route does not exist and responds with 'Article not found'", () => {
    const article_id = 20;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("status 400: incorrect syntax/format, responds with 'Bad request", () => {
    const article_id = "bananas";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status code: 200 - updates specified article with specified number of votes when incremented", () => {
    const article_id = 1;
    const newVotes = 10;
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
        });
      });
  });
  test("status code: 200 - updates specified article with specified number of votes when decremented", () => {
    const article_id = 1;
    const newVotes = -10;
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
        });
      });
  });
  test("status code: 200 - returns same article in database when inc_votes is 0", () => {
    const article_id = 1;
    const newVotes = 0;
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("status code: 404 - article does not exist and responds with 'Article not found'. ", () => {
    const article_id = 50;
    const newVotes = 10;
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("status code: 400 - invalid inc_votes type and responds with 'Bad request'", () => {
    const article_id = 1;
    const newVotes = "bananas";
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("status code: 400 - invalid article_id and responds with 'Bad request'", () => {
    const article_id = "bananas";
    const newVotes = 10;
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("status code: 400 - returns 'Bad request' when no inc_votes value given", () => {
    const article_id = 1;
    let newVotes;
    const articleUpdate = { inc_votes: newVotes };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(articleUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});


