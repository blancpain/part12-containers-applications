const testingRouter = require("express").Router();
const Blog = require("../mongo/models/blog");
const User = require("../mongo/models/user");

testingRouter.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = testingRouter;
