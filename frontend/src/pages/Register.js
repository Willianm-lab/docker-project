import React from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      nome: e.target.nome.value,
      email: e.target.email.value,
      senha: e.target.senha.value,
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.msg || "Erro no cadastro");
      alert("Cadastro realizado!");
      navigate("/");
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Cadastro</h1>
        <form onSubmit={handleRegister}>
          <input name="nome" type="text" placeholder="Nome" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="senha" type="password" placeholder="Senha" required />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
