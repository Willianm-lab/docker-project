import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ESSENCIAL
          },
        });

        if (!res.ok) throw new Error("Token inválido ou expirado");
        const body = await res.json();
        setUser(body.user);
      } catch (err) {
        alert("Erro: " + err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user)
    return (
      <div className="container">
        <div className="card">Carregando...</div>
      </div>
    );

  return (
    <div className="container">
      <div className="card">
        <h1>Bem-vindo, {user.nome}!</h1>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}

export default Dashboard;
