import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (email === "admin@gmail.com" && password === "tes123") {
      onLoginSuccess();
      navigate("/dashboard");
    } else {
      setError("Email atau password salah!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "90%" }}>
        <h3 className="text-center mb-4">Login</h3>

        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Info kecil */}
        <p className="text-center text-muted mt-3" style={{ fontSize: "0.9rem" }}>
          Gunakan <strong>admin@gmail.com</strong> / <strong>tes123</strong> untuk demo
        </p>
      </div>
    </div>
  );
}

export default Login;
