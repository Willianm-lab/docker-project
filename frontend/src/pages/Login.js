import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email: e.target.email.value, senha: e.target.senha.value };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.msg || "Erro no login");

      const token = body.access_token;
      // salva token e info do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(body.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="senha" type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
        <button className="link-btn" onClick={() => navigate("/register")}>
          Criar conta
        </button>
      </div>
    </div>
  );
}

export default Login;
