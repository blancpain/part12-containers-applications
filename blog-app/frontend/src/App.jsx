import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const allBlogs = () => {
    const currentBlogs = blogs
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          loggedUser={user}
          deleteBlog={deleteBlog}
        />
      ));

    return <div id="all-blogs">{currentBlogs}</div>;
  };

  const loginStatus = () => {
    return (
      <p style={{ fontWeight: "bold" }}>
        {user.username} logged in <button onClick={handleLogout}>logout</button>
      </p>
    );
  };

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (err) {
      setNotification({ message: "Wrong username or password", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const createdBlog = await blogService.create(blogObject);

    // adding username below since the mongoose populate() only gets called on GET
    // requests so username won't be populated until after refresh
    // potential more elegant solution - call populate on puts/deletes as well?
    const blogWithAddedName = {
      ...createdBlog,
      creator: { name: user.name, username: user.username },
    };
    setBlogs([...blogs, blogWithAddedName]);
    setNotification({
      message: `A new blog ${blogObject.title} by ${blogObject.author} added`,
    });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    const { name: targetedBlogId } = e.target;

    const targetedBlog = blogs.find((blog) => blog.id === targetedBlogId);
    const updatedLikes = targetedBlog.likes + 1;

    const updatedBlog = {
      title: targetedBlog.title,
      author: targetedBlog.author,
      url: targetedBlog.url,
      likes: updatedLikes,
    };

    await blogService.update(targetedBlogId.toString(), updatedBlog);

    setBlogs((prevState) =>
      prevState.map((blog) => {
        return blog.id === targetedBlogId
          ? { ...blog, likes: updatedLikes }
          : blog;
      })
    );
  };

  const deleteBlog = async (e) => {
    e.preventDefault();
    const { name: targetedBlogId } = e.target;
    const targetedBlog = blogs.find((blog) => blog.id === targetedBlogId);

    if (
      window.confirm(
        `Remove blog ${targetedBlog.title} by ${targetedBlog.author}`
      )
    ) {
      await blogService.remove(targetedBlogId.toString());
      setBlogs(blogs.filter((blog) => blog.id !== targetedBlogId));
    }
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />
      {user !== null && loginStatus()}
      {user !== null && (
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      )}
      {user === null ? (
        <Togglable buttonLabel="log in">
          <LoginForm login={login} />
        </Togglable>
      ) : (
        allBlogs()
      )}
    </div>
  );
};

export default App;
