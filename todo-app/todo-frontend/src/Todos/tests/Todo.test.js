import Todo from "../Todo";
import { render, screen } from "@testing-library/react";

describe("Todo component", () => {
  test("displays correctly on the DOM", () => {
    const newTodo = {
      text: "Testing!",
      done: true,
    };

    const doneInfo = jest.fn();
    const notDoneInfo = jest.fn();

    render(
      <Todo todo={newTodo} doneInfo={doneInfo} notDoneInfo={notDoneInfo} />
    );
    expect(screen.getByText(/Testing!/i)).toBeInTheDocument();
  });
});
