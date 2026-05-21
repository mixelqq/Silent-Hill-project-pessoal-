function carregarCurtidas(id) {

    let curtidas = localStorage.getItem("post-" + id);

    if (curtidas === null) {
        curtidas = 0;
    }

    const elemento = document.getElementById("likes-" + id);

    if (elemento) {
        elemento.innerText = curtidas;
    }
}

function animarBotao(id) {

    const botao = document.getElementById(id);

    if (!botao) return;

    botao.classList.add("animar");

    setTimeout(() => {

        botao.classList.remove("animar");

    }, 400);
}

function curtirPost(id) {

    let curtidas = localStorage.getItem("post-" + id);

    if (curtidas === null) {
        curtidas = 0;
    }

    curtidas++;

    localStorage.setItem("post-" + id, curtidas);

    carregarCurtidas(id);

    animarBotao("perturbador-" + id);
}

carregarCurtidas(1);
carregarCurtidas(2);

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

    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );

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

            <div class="likes">

                <button
                id="perturbador-${index}"
                onclick="curtirPost(${index})">

                    👍 Perturbador

                </button>

                <span id="likes-${index}">0</span>

            </div>

            <button onclick="deletarPost(${index})">
                Excluir
            </button>

        </div>
        `;

        carregarCurtidas(index);
    });
}

function deletarPost(index) {

    posts.splice(index, 1);

    localStorage.setItem(
        "posts",
        JSON.stringify(posts)
    );

    renderizarPosts();
}