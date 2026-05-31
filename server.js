const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.db");

/* UPLOAD DE AVATAR */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "silent-hill",
  resave: false,
  saveUninitialized: true
}));

// LOGIN
app.post("/login", (req, res) => {

  const { email, senha } = req.body;

  db.get(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, usuario) => {

      if (
        usuario &&
        bcrypt.compareSync(
          senha,
          usuario.senha
        )
      ) {

        req.session.usuario = usuario;

        res.json({
          sucesso: true
        });

      } else {

        res.json({
          erro:
          "Email ou senha inválidos"
        });
      }
    }
  );
});

// LOGOUT
app.get("/logout", (req, res) => {

  req.session.destroy();

  res.json({
    sucesso:
    "Logout realizado"
  });
});

// USUÁRIO
app.get("/usuario", (req, res) => {

  res.json(
    req.session.usuario || null
  );
});

// ALTERAR FOTO DE PERFIL
app.post(
  "/avatar",
  upload.single("avatar"),
  (req, res) => {

    if (!req.session.usuario) {

      return res.json({
        erro:
        "Faça login primeiro"
      });
    }

    if (!req.file) {

      return res.json({
        erro:
        "Nenhuma imagem enviada"
      });
    }

    const avatar =
      req.file.filename;

    db.run(
      `
      UPDATE usuarios
      SET avatar = ?
      WHERE id = ?
      `,
      [
        avatar,
        req.session.usuario.id
      ],
      (err) => {

        if (err) {

          console.log(err);

          return res.json({
            erro:
            "Erro ao salvar avatar"
          });
        }

        req.session.usuario.avatar =
          avatar;

        res.json({
          sucesso: true,
          avatar
        });
      }
    );
  }
);

// CRIAR POST
app.post("/criar-post", (req, res) => {

  if (!req.session.usuario) {

    return res.json({
      erro:
      "Faça login primeiro"
    });
  }

  const {
    titulo,
    mensagem
  } = req.body;

  db.run(
    `
    INSERT INTO posts
    (
      titulo,
      mensagem,
      autor,
      curtidas
    )
    VALUES
    (?, ?, ?, 0)
    `,
    [
      titulo,
      mensagem,
      req.session.usuario.email
    ],
    () => {

      res.json({
        sucesso:
        "Post criado com sucesso"
      });
    }
  );
});

// LISTAR POSTS
app.get("/posts", (req, res) => {

  db.all(
    "SELECT * FROM posts",
    (err, rows) => {

      res.json(rows);
    }
  );
});

// CURTIR POST
app.post("/curtir/:id", (req, res) => {

  const id =
    req.params.id;

  db.run(
    `
    UPDATE posts
    SET curtidas =
    curtidas + 1
    WHERE id = ?
    `,
    [id],
    () => {

      db.get(
        `
        SELECT curtidas
        FROM posts
        WHERE id = ?
        `,
        [id],
        (err, row) => {

          res.json({
            curtidas:
            row.curtidas
          });
        }
      );
    }
  );
});

// EXCLUIR POST
app.delete("/excluir/:id", (req, res) => {

  if (!req.session.usuario) {

    return res.json({
      erro:
      "Faça login primeiro"
    });
  }

  const id =
    req.params.id;

  db.get(
    `
    SELECT *
    FROM posts
    WHERE id = ?
    `,
    [id],
    (err, post) => {

      if (!post) {

        return res.json({
          erro:
          "Post não encontrado"
        });
      }

      if (
        post.autor !==
        req.session.usuario.email &&
        req.session.usuario.role !==
        "admin"
      ) {

        return res.json({
          erro:
          "Você não tem permissão para excluir este post"
        });
      }

      db.run(
        `
        DELETE FROM posts
        WHERE id = ?
        `,
        [id],
        (err) => {

          if (err) {

            return res.json({
              erro:
              "Erro ao excluir post"
            });
          }

          res.json({
            sucesso:
            "Post excluído com sucesso!"
          });
        }
      );
    }
  );
});

app.listen(
  3000,
  () => console.log(
    "Servidor rodando em http://localhost:3000"
  )
);