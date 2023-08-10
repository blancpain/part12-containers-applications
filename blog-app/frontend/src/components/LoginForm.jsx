import { useState } from "react";

export default function LoginForm({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const clearForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login({ username, password });
    clearForm();
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username{" "}
        <input
          type="text"
          id="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{" "}
        <input
          type="password"
          id="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <br />
      <button type="submit" id="login-button">
        login
      </button>
      <br />
      <br />
    </form>
  );
}
