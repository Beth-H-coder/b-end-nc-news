const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

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
  test("status code: 200 - responds with an object with all properties", () => {
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
  test("status code: 404 - route does not exist and responds with 'Article not found'", () => {
    const article_id = 20;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
  test("status code: 400 - incorrect syntax/format, responds with 'Bad request", () => {
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
  test("status code: 200 - responds with an array of user objects with properties of username, name and avatar_url", () => {
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
  test("status code 404 - route does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});

// GET /api/articles/:article_id (comment count)
// An article response object should also now include:
/*
-comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
come back - simlar to above 
*/
// describe("GET /api/articles/:article_id", () => {
//   test("status code: 200 - responds with an object with all properties, including additional 'comment_count' property", () => {
//     const article_id = 1;
//     return request(app)
//       .get(`/api/articlesarticles/${article_id}`)
//       .expect(200)
//       .then(({ body }) => {
//         const { article } = body;
//         expect(article).toEqual(
//           expect.objectContaining({
//             article_id: 1,
//             title: "Living in the shadow of a great man",
//             topic: "mitch",
//             author: "butter_bridge",
//             body: "I find this existence challenging",
//             created_at: "2020-07-09T20:11:00.000Z",
//             votes: 100,
//             comment_count: "11",
//           })
//         );
//       });
//   });
// });

describe("GET /api/articles", () => {
  test("status code: 200: responds with an array of article objects with all properties, including an additional 'count' property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status code : 200: responds with an array of objects that are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        let timeDifference = articles.map((article) => {
          let myDate = new Date(article.created_at);
          let created_at_in_ms = myDate.getTime();
          let difference = Date.now() - created_at_in_ms;
          return difference;
        });
        let orderIsDesc = timeDifference.slice(1).every((ms_time, i) => {
          return ms_time >= timeDifference[i];
        });
        expect(orderIsDesc).toBe(true);
      });
  });
  test("status code : 200: responds with a comment_count property that totals all comments for each article_id and has a total of zero for those articles without comments ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[5]).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: "11",
          })
        );
      });
  });
  test("status code : 404: route does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid path");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: returns an array of comments objects that includes the appropriate properties", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        let comments = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("status 200: returns array of comments objects with corrector specified article_id", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          {
            comment_id: 10,
            body: "git push origin master",
            article_id: 3,
            author: "icellusedkars",
            article_id: 3,
            votes: 0,
            created_at: "2020-06-20T07:24:00.000Z",
          },
          {
            comment_id: 11,
            body: "Ambidextrous marsupial",
            article_id: 3,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-09-19T23:10:00.000Z",
          },
        ]);
      });
  });
  test("status 404: no comments exist for specified article ", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments exist for the requested ID");
      });
  });
  test("status 404: article does not exist ", () => {
    const article_id = 20;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  test("status code: 400 - responds with 'Bad request' when passed a non-integer for article_id ", () => {
    const article_id = "frances";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
