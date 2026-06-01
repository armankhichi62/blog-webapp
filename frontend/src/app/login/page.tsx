"use client";

import { useState } from "react";
import api from "../../services/api";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (error: any) {
  alert(error.response?.data?.message);
}
  };

  return (
    <div className="max-w-md mx-auto mt-20 border p-8 rounded shadow">
      <h1>Login</h1>

      <input className="w-full border p-3 rounded"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input className="w-full border p-3 rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button className="w-full bg-blue-600 text-white p-3 rounded" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}