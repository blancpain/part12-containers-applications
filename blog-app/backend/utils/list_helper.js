const _ = require("lodash");

const dummy = (blogs) => {
  return blogs.length + 1;
};

const totalLikes = (list) => {
  return list.reduce((acc, obj) => acc + obj.likes, 0);
};

const favoriteBlog = (list) => {
  if (list.length === 0) return null;

  const blogWithMostLikes = list.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current;
  });

  const { title, author, likes } = blogWithMostLikes;

  return { title, author, likes };
};

const mostBlogs = (list) => {
  if (list.length === 0) return null;

  const filteredList = list.reduce((acc, current) => {
    if (acc[current.author]) {
      acc[current.author] = acc[current.author] + 1;
    } else {
      acc[current.author] = 1;
    }

    return acc;
  }, {});

  const max = Object.keys(filteredList).reduce((acc, curr) => {
    return filteredList[curr] > acc ? filteredList[curr] : acc;
  }, -Infinity);

  const authorWithMostBlogs = Object.keys(filteredList).find((author) => {
    return filteredList[author] === max;
  });

  return {
    author: authorWithMostBlogs,
    blogs: max,
  };
};

const mostLikes = (list) => {
  if (list.length === 0) return null;

  return _(list)
    .groupBy("author")
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, "likes"),
    }))
    .maxBy("likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
