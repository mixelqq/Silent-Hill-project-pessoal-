function toggleMenu() {

    const menu = document.querySelector(".menu-lateral");

    menu.classList.toggle("ativo");

}
// 💡 Luz piscando aleatória

const luz = document.getElementById("luz");

function piscarLuz() {

    if (!luz) return;

    // chance aleatória de piscar
    let chance = Math.random();

    if (chance > 0.85) {

        luz.classList.add("luz-apagada");

        setTimeout(() => {
            luz.classList.remove("luz-apagada");
        }, 100);

    }

}

// verifica a cada tempo aleatório
setInterval(piscarLuz, 500);