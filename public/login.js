function login() {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    fetch("/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })

    .then(res => res.json())

    .then(data => {

        if (data.sucesso) {

            alert("Login realizado!");

            window.location.href = "index.html";

        } else {

            alert("Email ou senha incorretos");
        }
    })

    .catch(() => {
        alert("Erro no servidor");
    });
}

function cadastrar() {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    fetch("/cadastro", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })

    .then(res => res.text())

    .then(data => {

        alert(data);

        if (data.includes("realizado")) {

            window.location.href = "login.html";
        }
    })

    .catch(() => {
        alert("Erro ao cadastrar");
    });
}

/* login */
app.post("/login", (req, res) => {

    const { email, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha],
        (err, row) => {

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