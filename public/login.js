function login() {
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
    })

    .catch(() => {
        alert("Erro ao cadastrar");
    });
}

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

    .then(res => {

        if (!res.ok) {
            throw new Error("Login inválido");
        }

        return res.text();
    })

    .then(data => {

        alert(data);

        window.location.href = "index.html";
    })

    .catch(err => {
        alert("Email ou senha incorretos");
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
    });
}