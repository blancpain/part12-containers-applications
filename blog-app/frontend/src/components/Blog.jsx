import { useState } from "react";

/* eslint-disable react/prop-types */
const Blog = ({ blog, updateBlog, loggedUser, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [showDetails, setShowDetails] = useState(false);

  let creatorName;
  let username;

  if (blog.creator) {
    creatorName = blog.creator.name;
    username = blog.creator.username;
  } else if (blog.user) {
    creatorName = blog.user.name;
    username = blog.user.username;
  } else {
    return;
  }

  const additionalDetails = () => {
    return (
      <>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{" "}
          <button name={blog.id} onClick={updateBlog} id="like-button">
            like
          </button>
        </div>
        <div> added by {creatorName} </div>
        {loggedUser.username === username && (
          <button
            name={blog.id}
            onClick={deleteBlog}
            style={{ backgroundColor: "blue", color: "white" }}
            id="delete-button"
          >
            delete
          </button>
        )}
      </>
    );
  };

  return (
    <div style={blogStyle} data-testid="blog-component" id="blog">
      <div>
        {blog.title} {blog.author}{" "}
        <button
          onClick={() => setShowDetails(!showDetails)}
          data-testid="view-btn"
        >
          {showDetails ? "hide" : "view"}
        </button>
      </div>
      {showDetails && additionalDetails()}
    </div>
  );
};

export default Blog;
