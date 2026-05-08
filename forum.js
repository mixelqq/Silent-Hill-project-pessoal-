function carregarCurtidas(id){

    let curtidas = localStorage.getItem("post-" + id);

    if(curtidas === null){
        curtidas = 0;
    }

    document.getElementById("likes-" + id).innerText = curtidas;
}

function curtirPost(id){

    let curtidas = localStorage.getItem("post-" + id);

    if(curtidas === null){
        curtidas = 0;
    }

    curtidas++;

    localStorage.setItem("post-" + id, curtidas);

    document.getElementById("likes-" + id).innerText = curtidas;
}

carregarCurtidas(1);

function curtirPost(id){
    alert("Você marcou como Perturbador");
}

function ameiPost(id){
    alert("Você marcou como Obra-prima");
}

function medoPost(id){
    alert("Você marcou como Traumatizante");
}
function animarBotao(id){

    const botao = document.getElementById(id);

    botao.classList.add("animar");

    setTimeout(() => {
        botao.classList.remove("animar");
    }, 400);
}

function curtirPost(id){

    animarBotao("perturbador-" + id);

}

function ameiPost(id){

    animarBotao("obra-" + id);

}

function medoPost(id){

    animarBotao("medo-" + id);

}