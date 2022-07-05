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
/*

. GET /api/articles/:article_id
Responds with:
- an article object, which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
*/

describe.only("GET /api/articles/:article_id", () => {
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
  test.only("status 404: route does not exist", () => {
    const article_id = 20;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});
