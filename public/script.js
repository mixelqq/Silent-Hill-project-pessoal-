function toggleMenu() {

    const menu = document.querySelector(".menu-lateral");

    menu.classList.toggle("ativo");

}
/* 🔍 Abrir mapa */

function abrirMapa(img){

const zoom = document.getElementById("zoomMapa");

const imgZoom = document.getElementById("imgZoom");

zoom.style.display = "flex";

imgZoom.src = img.src;

}

/* ❌ Fechar mapa */

function fecharMapa(){

document.getElementById("zoomMapa").style.display = "none";

}





