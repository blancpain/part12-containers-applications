const blogsRouter = require("express").Router();
const Blog = require("../mongo/models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "operation not permitted" });
  }

  if (!body.url) {
    response.status(400).json({ error: "url missing" });
  } else if (!body.title) {
    response.status(400).json({ error: "title missing" });
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });

    blog.user = user._id;
    let savedBlog = await blog.save();
    user.blogs = [...user.blogs, savedBlog._id];
    await user.save();

    // we do the below so that the returned object shows the user immediately
    // on render without having to refresh the page and send another GET
    // request which will populate the user...

    savedBlog = await Blog.findById(savedBlog._id).populate("user");

    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blogToBeDeleted = await Blog.findById(request.params.id);

    if (!blogToBeDeleted) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blogToBeDeleted.author === "Admin") {
      return response.status(404).json({ error: "cannot delete this blog" });
    }

    if (user.id.toString() === blogToBeDeleted.user.toString()) {
      await Blog.deleteOne(blogToBeDeleted);

      response.status(204).end();
    } else {
      response.status(401).json({ error: "invalid user" });
    }
  }
);

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  // check if blog exists first

  const targetedBlog = await Blog.findById(request.params.id);

  if (!targetedBlog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (!body.url) {
    response.status(400).json({ error: "url missing" });
  } else if (!body.title) {
    response.status(400).json({ error: "title missing" });
  } else {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    };

    let blogToBeUpdated = await Blog.findByIdAndUpdate(
      request.params.id,

      blog,

      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    blogToBeUpdated = await Blog.findById(blogToBeUpdated._id).populate("user");
    response.json(blogToBeUpdated);
  }
});

// comments

blogsRouter.post("/:id/comments", async (request, response) => {
  const comment = request.body.comment;
  const targetedBlog = await Blog.findById(request.params.id);

  if (!comment) {
    return response.status(400).json({ error: "Comments cannot be blank" });
  }

  targetedBlog.comments = [...targetedBlog.comments, comment];
  await targetedBlog.save();
  const updatedBlog = await Blog.findById(targetedBlog._id).populate("user");

  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
