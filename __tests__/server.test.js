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
  test.only("status 404: route does not exist", () => {
    return request(app)
      .get("/api/invalidpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid path");
      });
  });
});
