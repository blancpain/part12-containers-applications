import { useState } from "react";

export default function BlogForm({ createBlog }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (e) => {
    e.preventDefault();
    const newBlog = {
      title,
      author,
      url,
    };
    createBlog(newBlog);
    clearForm();
  };

  const clearForm = () => {
    setAuthor("");
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={addBlog} data-testid="blog-form">
      <h2>create new</h2>
      <div>
        title{" "}
        <input
          type="text"
          value={title}
          id="title"
          name="Title"
          placeholder="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author{" "}
        <input
          type="text"
          value={author}
          name="Author"
          id="author"
          placeholder="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url{" "}
        <input
          type="text"
          value={url}
          name="URL"
          id="url"
          placeholder="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <br />
      <button type="submit" id="create-blog">
        create
      </button>
      <br />
      <br />
    </form>
  );
}
