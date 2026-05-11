const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(express.json());
app.use(express.static("public"));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            senha TEXT
        )
    `);
});

app.post("/cadastro", (req, res) => {
    const { email, senha } = req.body;

    db.run(
        "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
        [email, senha],
        (err) => {
            if (err) {
                res.status(500).send("Erro");
            } else {
                res.send("Usuário cadastrado");
            }
        }
    );
});

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha],
        (err, row) => {

            if (err) {
                return res.status(500).send("Erro no servidor");
            }

            if (row) {
                res.send("Login realizado");
            } else {
                res.status(401).send("Email ou senha incorretos");
            }
        }
    );
});



app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});