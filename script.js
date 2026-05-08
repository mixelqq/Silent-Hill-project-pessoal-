function toggleMenu() {

    const menu = document.querySelector(".menu-lateral");

    menu.classList.toggle("ativo");

}

function login() {

    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if(email === "admin@gmail.com" && senha === "1234") {

        localStorage.setItem("logado", "true");
        localStorage.setItem("usuario", email);

        window.location.href = "index.html";

    } else {

        alert("Login inválido");

    }
}

