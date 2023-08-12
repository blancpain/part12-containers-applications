db.createUser({
  user: "the_username",
  pwd: "the_password",
  roles: [
    {
      role: "dbOwner",
      db: "the_database",
    },
  ],
});

db.createCollection("blogs");

db.blogs.insert({
  title: "The very first blog",
  author: "Admin",
  url: "www.docker-rocks.com",
  user: "Admin",
  likes: 10,
});
