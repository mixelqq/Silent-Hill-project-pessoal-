
app.post("/login", (req, res) => {

    const email = req.body.email;

    const senha = req.body.senha;

    db.get(

        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",

        [email, senha],

        (err, usuario) => {

            if (err) {

                console.log(err);

                return res.status(500).send(
                    "Problema no servidor"
                );
            }

            if (!usuario) {

                return res.send(
                    "Usuário não encontrado"
                );
            }

            if (usuario.banido === 1) {

                return res.send(
                    "Você foi banido"
                );
            }

            req.session.usuario = usuario;

            res.send("Login realizado");
        }
    );
});

