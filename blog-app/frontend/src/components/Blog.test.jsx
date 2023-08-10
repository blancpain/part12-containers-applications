/* eslint-disable vitest/expect-expect */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import { beforeEach, expect } from "vitest";

describe("Blog component", () => {
  const updateLikes = vi.fn();
  beforeEach(() => {
    const blog = {
      title: "Testing rocks",
      author: "Yasen",
      url: "www.testing.com",
      likes: 20,
      creator: {
        username: "testUser",
        name: "Yasen D",
      },
    };
    render(
      <Blog
        blog={blog}
        loggedUser={{ username: "testUser", name: "Yasen D" }}
        updateBlog={updateLikes}
      />
    );
  });

  test("correctly shows title and author but no further details by default", () => {
    expect(screen.getByText(/testing rocks/i)).toBeInTheDocument();
    expect(screen.getByText(/yasen/i)).toBeInTheDocument();
    expect(screen.queryByText(/www.testing.com/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/likes/i)).not.toBeInTheDocument();
  });

  test("shows likes when view button is clicked", async () => {
    const user = userEvent.setup();

    const viewBtn = screen.getByTestId("view-btn");
    await user.click(viewBtn);

    // const elem = screen.getByTestId("blog-component");
    // screen.debug(el em);

    expect(screen.getByText(/likes 20/i)).toBeInTheDocument();
    expect(screen.getByText(/www.testing.com/i)).toBeInTheDocument();
  });

  test("like button works correctly", async () => {
    const user = userEvent.setup();

    const viewBtn = screen.getByTestId("view-btn");
    await user.click(viewBtn);

    const likeBtn = screen.getByText("like");
    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(updateLikes.mock.calls).toHaveLength(2);
  });
});

describe("Blog form", () => {
  test("calls the event handler with correct details", async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    // const elem = screen.getByTestId("blog-form");
    // screen.debug(elem);

    const titleInput = screen.getByPlaceholderText("title");
    const authorInput = screen.getByPlaceholderText("author");
    const urlInput = screen.getByPlaceholderText("url");
    const createBtn = screen.getByText("create");

    await user.type(titleInput, "title");
    await user.type(authorInput, "author");
    await user.type(urlInput, "www.url.com");
    await user.click(createBtn);

    expect(createBlog.mock.calls).toHaveLength(1);

    expect(createBlog.mock.calls[0][0].title).toBe("title");
    expect(createBlog.mock.calls[0][0].author).toBe("author");
    expect(createBlog.mock.calls[0][0].url).toBe("www.url.com");
  });
});
