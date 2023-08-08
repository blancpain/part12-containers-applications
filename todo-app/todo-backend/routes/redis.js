const express = require("express");
const router = express.Router();
const { getAsync, setAsync } = require("../redis/index");

/* GET redis counter. */
router.get("/", async (_, res) => {
  const currentCount = await getAsync("added_todos");
  res.json({ added_todos: currentCount });
});

module.exports = router;
