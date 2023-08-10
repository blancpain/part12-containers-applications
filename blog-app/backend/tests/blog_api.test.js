const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const helper = require("./test_helper");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObj = new Blog(helper.initialBlogs[0]);
  await blogObj.save();
  blogObj = new Blog(helper.initialBlogs[1]);
  await blogObj.save();
});

describe("when there are initially some saved blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("a specific author is correctly found", async () => {
    const response = await api.get("/api/blogs");
    const author = response.body.map((r) => r.author);
    expect(author).toContain("Michael Chan");
  });

  test("blog posts have an 'id' property", async () => {
    const response = await api.get("/api/blogs");
    const blogOne = response.body[0];
    expect(blogOne.id).toBeDefined();
  });
});

describe("when adding a blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("somePass", 10);
    const initialUser = new User({
      username: "root",
      name: "Super",
      passwordHash,
    });
    await initialUser.save();
  });

  test("it can be added correctly", async () => {
    const newBLog = {
      _id: "5a422ba71b54a676234d17fb",
      title: "Testing rocks",
      author: "Yasen Dimitrov",
      url: "https://www.someURL.com",
      likes: 50,
      __v: 0,
    };

    const user = await User.findOne({ name: "Super" });
    const token = helper.createToken(user.username, user._id);

    await api
      .post("/api/blogs")
      .set("Authorization", token)
      .send(newBLog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await helper.blogsInDb();
    expect(updatedBlogs).toHaveLength(helper.initialBlogs.length + 1);
    const contents = updatedBlogs.map((r) => r.title);
    expect(contents).toContain("Testing rocks");
  });

  test("likes default to 0 if not provided", async () => {
    const newBlog = {
      _id: "5a422ba71b54a676234d17fb",
      title: "Testing rocks",
      author: "Yasen Dimitrov",
      url: "https://www.someURL.com",
      __v: 0,
    };

    const user = await User.findOne({ name: "Super" });
    const token = helper.createToken(user.username, user._id);

    await api.post("/api/blogs").set("Authorization", token).send(newBlog);
    const response = await api.get("/api/blogs");
    const addedBlog = response.body[2];

    expect(addedBlog.likes).toBe(0);
  });

  test("backend responds with status 400 bad request if blog is created without URL", async () => {
    const newBlog = {
      _id: "5a422ba71b54a676234d17fb",
      title: "Testing rocks",
      author: "Yasen Dimitrov",
      __v: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("backend responds with status 400 bad request if blog is created without title", async () => {
    const newBlog = {
      _id: "5a422ba71b54a676234d17fb",
      url: "https://www.someURL.com",
      author: "Yasen Dimitrov",
      __v: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("deletion of a blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("somePass", 10);
    const initialUser = new User({
      username: "root",
      name: "Super",
      passwordHash,
    });
    await initialUser.save();
  });

  test("succeeds with status code 204 and correctly returns updated number of blogs", async () => {
    const newBLog = {
      title: "Testing rocks",
      author: "Super",
      url: "https://www.someURL.com",
      likes: 50,
    };

    // first we create a blog that is linked to the initialUser
    const user = await User.findOne({ name: "Super" });
    const token = helper.createToken(user.username, user._id);
    await api.post("/api/blogs").set("Authorization", token).send(newBLog);

    const blogsAtStart = await helper.blogsInDb();

    // then we delete it
    const blogToBeDeleted = await Blog.findOne({ title: "Testing rocks" });

    await api
      .delete(`/api/blogs/${blogToBeDeleted._id}`)
      .set("Authorization", token)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  });
});

describe("updating a blog", () => {
  test("works for updating likes", async () => {
    const newBlog = {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",

      likes: 65,
    };

    await api.put("/api/blogs/5a422aa71b54a676234d17f8").send(newBlog);
    const response = await api.get("/api/blogs/");
    expect(response.body[1].likes).toBe(65);
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("somePass", 10);
    const user = new User({ username: "root", name: "someName", passwordHash });

    await user.save();
  });

  test("creation of another valid user succeeds", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "yas",
      name: "Yasen",
      password: "somePass2",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if user already exists", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Yasen",
      password: "somePass2",
    };

    const response = await api.post("/api/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.text).toContain("to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "someUser",
      name: "Yasen",
      password: "12",
    };

    const response = await api.post("/api/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.text).toContain(
      "password needs to be longer than 3 characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "12",
      name: "Yasen",
      password: "1234",
    };

    const response = await api.post("/api/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.text).toContain("shorter than the minimum allowed length");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Yasen",
      password: "1234",
    };

    const response = await api.post("/api/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.text).toContain("is required");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is not given", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "asdf",
      name: "Yasen",
    };

    const response = await api.post("/api/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.text).toContain("password needs to be provided");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe("Assigning blogs to users", () => {
  test("correctly adds to user.blogs array", async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("somePass", 10);
    const user = new User({ username: "root", name: "someName", passwordHash });
    const newUser = await user.save();

    const newBlog = {
      _id: "5a422ba71b54a676234d17fb",
      title: "Testing rocks",
      author: "Yasen Dimitrov",
      url: "https://www.someURL.com",
      user: newUser.id,
      likes: 50,
      __v: 0,
    };

    const token = helper.createToken(newUser.username, newUser._id);
    await api.post("/api/blogs").set("Authorization", token).send(newBlog);
    const updatedUser = await User.findById(newUser.id);

    expect(updatedUser.blogs).toHaveLength(1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
