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

const postsDiv = document.getElementById("posts");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

renderizarPosts();

function criarPost() {

    const titulo = document.getElementById("titulo").value;

    const mensagem = document.getElementById("mensagem").value;

    if (titulo === "" || mensagem === "") {

        alert("Preencha tudo!");

        return;
    }

    const novoPost = {

        titulo,
        mensagem
    };

    posts.push(novoPost);

    localStorage.setItem("posts", JSON.stringify(posts));

    renderizarPosts();

    document.getElementById("titulo").value = "";

    document.getElementById("mensagem").value = "";
}

function renderizarPosts() {

    postsDiv.innerHTML = "";

    posts.forEach((post, index) => {

        postsDiv.innerHTML += `

        <div class="post">

            <h2>${post.titulo}</h2>

            <p>${post.mensagem}</p>

            <button onclick="deletarPost(${index})">
            Excluir
            </button>

        </div>
        `;
    });
}

function deletarPost(index) {

    posts.splice(index, 1);

    localStorage.setItem("posts", JSON.stringify(posts));

    renderizarPosts();
}