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
      .then(({ body: { msg } }) => {
        //console.log(response);
        expect(msg).toBe("Invalid path");
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
        expect(body.msg).toBe("Invalid data type");
      });
  });
});

describe("GET /api/users", () => {
  test("status 200: responds with an array of user objects with properties of username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404: route does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});
/*
7. GET /api/articles/:article_id (comment count)
An article response object should also now include:

-comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
come back - simlar to above 

describe("GET /api/articles/:article_id", () => {
  test(" ", () => {});
});


*/
//8  GET /api/articles

// describe("GET /api/articles", () => {
//   test.only("status 200: responds with an array of article objects with all properties and an additional 'count' property", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then(({ body }) => {
//         4;
//         const { articles } = body;
//         expect(articles).toBeInstanceOf(Array);
//         expect(articles).toHaveLength(12);
//         articles.forEach((article) => {
//           expect(article).toEqual(
//             expect.objectContaining({
//               author: expect.any(String),
//               title: expect.any(String),
//               article_id: expect.any(Number),
//               topic: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//               comment_count: expect.any(Number),
//               body: expect.any(String),
//             })
//           );
//         });
//       });
//   });
// });
