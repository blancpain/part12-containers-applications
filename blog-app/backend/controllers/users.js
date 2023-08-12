const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../mongo/models/user");

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "password needs to be provided" });
  } else if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "password needs to be longer than 3 characters" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    author: 1,
    title: 1,
    url: 1,
    likes: 1,
  });

  res.json(users);
});

module.exports = usersRouter;
