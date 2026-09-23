import { useState } from "react";

function Auth() {
  const [isRegister, setIsRegister] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      if (!isRegister) {
        localStorage.setItem(
          "shopzoneUser",
          JSON.stringify(data.user)
        );

        window.location.reload();
      }

      console.log("User:", data.user);
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-box">

        <h2>
          {isRegister ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={handleSubmit}>

          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            {isRegister ? "Register" : "Login"}
          </button>

        </form>

        <p>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? " Login" : " Register"}
          </button>
        </p>

      </div>

    </div>
  );
}

export default Auth;