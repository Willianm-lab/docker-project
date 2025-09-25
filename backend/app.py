import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from dotenv import load_dotenv
from bson.objectid import ObjectId

load_dotenv()  # carrega .env

app = Flask(__name__)
CORS(app)

# Config
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET", "dev-secret")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "jwt-secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60 * 24  # 1 dia (segundos)

jwt = JWTManager(app)

# MongoDB
#MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")

DB_NAME = os.getenv("DB_NAME", "meus_dados")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
usuarios = db["usuarios"]

# Helpers
def user_public(user_doc):
    # transforma documento Mongo em JSON público (remove senha)
    return {
        "id": str(user_doc.get("_id")),
        "nome": user_doc.get("nome"),
        "email": user_doc.get("email")
    }

# Routes
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json or {}
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({"msg": "nome, email e senha são obrigatórios"}), 400

    # verifica se já existe
    if usuarios.find_one({"email": email}):
        return jsonify({"msg": "Email já cadastrado"}), 400

    senha_hash = generate_password_hash(senha)
    novo = {"nome": nome, "email": email, "senha": senha_hash}
    res = usuarios.insert_one(novo)
    novo_doc = usuarios.find_one({"_id": res.inserted_id})
    return jsonify({"msg": "Usuário criado", "user": user_public(novo_doc)}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"msg": "email e senha são obrigatórios"}), 400

    user = usuarios.find_one({"email": email})
    if not user or not check_password_hash(user.get("senha", ""), senha):
        return jsonify({"msg": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity=str(user["_id"]))
    return jsonify({
        "access_token": access_token,
        "user": user_public(user)
    }), 200

@app.route("/api/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()  # aqui usamos _id armazenado no identity
    user = usuarios.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"msg": "Usuário não encontrado"}), 404
    return jsonify({"user": user_public(user)}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
