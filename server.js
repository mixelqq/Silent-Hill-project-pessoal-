const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

/* =========================
CONFIG
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "silent-hill",
    resave: false,
    saveUninitialized: true
}));

/* =========================
UPLOAD AVATAR
========================= */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/avatars/");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

/* =========================
TABELAS
========================= */
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT UNIQUE,senha TEXT,role TEXT DEFAULT 'user',avatar TEXT DEFAULT 'default.png',banido INTEGER DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT,titulo TEXT,mensagem TEXT,autor TEXT,curtidas INTEGER DEFAULT 0,fixado INTEGER DEFAULT 0)");
    db.run("CREATE TABLE IF NOT EXISTS comentarios (id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER,autor TEXT,comentario TEXT)");
});

/* =========================
CADASTRO
========================= */
app.post("/cadastro", (req, res) => {
    const { email, senha } = req.body;
    db.run("INSERT INTO usuarios (email, senha) VALUES (?, ?)", [email, senha], function(err) {
        if (err) return res.send("Usuário já existe");
        res.send("Cadastro realizado");
    });
});

/* =========================
LOGIN
========================= */
app.post("/login", (req, res) => {
    const { email, senha } = req.body;
    db.get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha], (err, usuario) => {
        if (err) return res.status(500).send("Problema no servidor");
        if (!usuario) return res.send("Usuário não encontrado");
        if (usuario.banido === 1) return res.send("Você foi banido");

        req.session.usuario = usuario;
        res.redirect("/"); // redireciona para home
    });
});

/* =========================
USUARIO
========================= */
app.get("/usuario", (req, res) => {
    if (!req.session.usuario) return res.json(null);
    res.json(req.session.usuario);
});

/* =========================
LOGOUT
========================= */
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.send("Logout realizado"));
});

/* =========================
POSTS
========================= */
app.get("/posts", (req, res) => {
    db.all("SELECT * FROM posts ORDER BY fixado DESC, id DESC", [], (err, rows) => {
        res.json(rows);
    });
});

/* criar post */
app.post("/criar-post", (req, res) => {
    if (!req.session.usuario) return res.send("Faça login");
    const { titulo, mensagem } = req.body;
    db.run("INSERT INTO posts (titulo, mensagem, autor) VALUES (?, ?, ?)", [titulo, mensagem, req.session.usuario.email], () => {
        res.send("Post criado");
    });
});

/* curtir */
app.post("/curtir/:id", (req, res) => {
    db.run("UPDATE posts SET curtidas = curtidas + 1 WHERE id = ?", [req.params.id], () => {
        db.get("SELECT curtidas FROM posts WHERE id = ?", [req.params.id], (err, row) => {
            res.json({ curtidas: row.curtidas });
        });
    });
});

/* deletar */
app.delete("/deletar/:id", (req, res) => {
    if (!req.session.usuario) return res.send("Login necessário");
    if (req.session.usuario.role !== "admin") return res.send("Apenas admin");
    db.run("DELETE FROM posts WHERE id = ?", [req.params.id], () => res.send("Post deletado"));
});

/* fixar */
app.post("/fixar/:id", (req, res) => {
    if (!req.session.usuario) return res.send("Login necessário");
    if (req.session.usuario.role !== "admin") return res.send("Apenas admin");
    db.run("UPDATE posts SET fixado = 1 WHERE id = ?", [req.params.id], () => res.send("Post fixado"));
});

/* =========================
COMENTARIOS
========================= */
app.get("/comentarios/:id", (req, res) => {
    db.all("SELECT * FROM comentarios WHERE post_id = ?", [req.params.id], (err, rows) => res.json(rows));
});
app.post("/comentar/:id", (req, res) => {
    if (!req.session.usuario) return res.send("Faça login");
    db.run("INSERT INTO comentarios (post_id, autor, comentario) VALUES (?, ?, ?)", [req.params.id, req.session.usuario.email, req.body.comentario], () => res.send("Comentado"));
});

/* =========================
BANIR
========================= */
app.post("/banir", (req, res) => {
    if (!req.session.usuario) return res.send("Login necessário");
    if (req.session.usuario.role !== "admin") return res.send("Apenas admin");
    db.run("UPDATE usuarios SET banido = 1 WHERE email = ?", [req.body.email], () => res.send("Usuário banido"));
});

/* =========================
AVATAR
========================= */
app.post("/upload-avatar", upload.single("avatar"), (req, res) => {
    if (!req.session.usuario) return res.send("Faça login");
    const avatar = req.file.filename;
    db.run("UPDATE usuarios SET avatar = ? WHERE id = ?", [avatar, req.session.usuario.id], () => {
        req.session.usuario.avatar = avatar;
        res.send("Avatar atualizado");
    });
});

/* =========================
SERVIDOR
========================= */
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

