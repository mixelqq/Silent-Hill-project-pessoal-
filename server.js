const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("database.db");

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* arquivos da pasta public */
app.use(express.static(path.join(__dirname, "public")));

/* cria tabela */
db.run(`
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    senha TEXT
)
`);

/* cadastro */
app.post("/cadastro", (req, res) => {

    const { email, senha } = req.body;

    db.run(
        "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
        [email, senha],
        function(err) {

            if (err) {
                return res.send("Usuário já existe.");
            }

            res.send("Cadastro realizado!");
        }
    );
});

/* login */
app.post("/login", (req, res) => {

    const { email, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    sucesso: false,
                    erro: "Erro no servidor"
                });
            }

            if (row) {

                res.json({
                    sucesso: true
                });

            } else {

                res.json({
                    sucesso: false
                });
            }
        }
    );
});

/* inicia servidor */
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});