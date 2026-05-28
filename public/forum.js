
const postsDiv = document.getElementById("posts");

let usuarioAtual = null;

/* =========================
USUARIO
========================= */

async function carregarUsuario() {

    const resposta = await fetch("/usuario");

    usuarioAtual = await resposta.json();
}

/* =========================
POSTS
========================= */

async function carregarPosts() {

    const resposta = await fetch("/posts");
    const posts = await resposta.json();

    postsDiv.innerHTML = "";

    for (const post of posts) {

        const comentariosResposta =
            await fetch("/comentarios/" + post.id);
        const comentarios =
            await comentariosResposta.json();

        let comentariosHtml = "";

        comentarios.forEach((c) => {
            comentariosHtml +=
                '<div class="comentario">' +
                    '<b>' + c.autor + '</b>' +
                    '<p>' + c.comentario + '</p>' +
                '</div>';
        });

        let adminHtml = "";

        if (
            usuarioAtual &&
            usuarioAtual.role === "admin"
        ) {
            adminHtml =
                '<button onclick="deletarPost(' + post.id + ')">Excluir</button>' +
                '<button onclick="fixarPost(' + post.id + ')">Fixar</button>' +
                '<button onclick="banirUsuario(\'' + post.autor + '\')">Banir</button>';
        }

        postsDiv.innerHTML +=
            '<div class="post ' + (post.fixado ? "fixado" : "") + '">' +
                (post.fixado
                    ? '<div class="tag-fixado">📌 FIXADO</div>'
                    : '') +
                '<h2>' + post.titulo + '</h2>' +
                '<p>' + post.mensagem + '</p>' +
                '<span>Postado por ' + post.autor + '</span>' +
                '<div class="likes">' +
                    '<button onclick="curtirPost(' + post.id + ')">👍 Perturbador</button>' +
                    '<span>' + post.curtidas + '</span>' +
                '</div>' +
                adminHtml +
                '<div class="comentarios">' +
                    '<h3>Comentários</h3>' +
                    comentariosHtml +
                    '<textarea id="comentario-' + post.id + '" placeholder="Digite um comentário"></textarea>' +
                    '<button onclick="comentar(' + post.id + ')">Comentar</button>' +
                '</div>' +
            '</div>';
    }
}

/* =========================
CRIAR POST
========================= */

async function criarPost() {

    const titulo =
        document.getElementById("titulo").value;

    const mensagem =
        document.getElementById("mensagem").value;

    const resposta = await fetch(

        "/criar-post",

        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                titulo: titulo,
                mensagem: mensagem
            })
        }
    );

    const texto = await resposta.text();

    alert(texto);

    carregarPosts();
}

/* =========================
COMENTAR
========================= */

async function comentar(id) {

    const comentario =

        document.getElementById(
            "comentario-" + id
        ).value;

    await fetch(

        "/comentar/" + id,

        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                comentario: comentario
            })
        }
    );

    carregarPosts();
}

/* =========================
CURTIR
========================= */

async function curtirPost(id) {

    await fetch(

        "/curtir/" + id,

        {

            method: "POST"
        }
    );

    carregarPosts();
}

/* =========================
DELETAR
========================= */

async function deletarPost(id) {

    await fetch(

        "/deletar/" + id,

        {

            method: "DELETE"
        }
    );

    carregarPosts();
}

/* =========================
FIXAR
========================= */

async function fixarPost(id) {

    await fetch(

        "/fixar/" + id,

        {

            method: "POST"
        }
    );

    carregarPosts();
}

/* =========================
BANIR
========================= */

async function banirUsuario(email) {

    await fetch(

        "/banir",

        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                email: email
            })
        }
    );

    alert("Usuário banido");
}

/* =========================
PERFIL
========================= */

async function atualizarPerfil() {

    if (!usuarioAtual) {

        return;
    }

    document.getElementById(
        "email-usuario"
    ).innerText =
    usuarioAtual.email;

    document.getElementById(
        "avatar"
    ).src =
    "/avatars/" + usuarioAtual.avatar;

    if (usuarioAtual.role === "admin") {

        document.getElementById(
            "painel-admin"
        ).style.display = "block";
    }
}

/* =========================
UPLOAD AVATAR
========================= */

async function uploadAvatar() {

    const input =
        document.getElementById(
            "avatarInput"
        );

    if (!input.files[0]) {

        alert("Escolha uma imagem");

        return;
    }

    const formData = new FormData();

    formData.append(
        "avatar",
        input.files[0]
    );

    const resposta = await fetch(

        "/upload-avatar",

        {

            method: "POST",

            body: formData
        }
    );

    const texto =
        await resposta.text();

    alert(texto);

    location.reload();
}

/* =========================
LOGOUT
========================= */

async function logout() {

    await fetch("/logout");

    location.reload();
}

/* =========================
INICIAR
========================= */

async function iniciar() {

    await carregarUsuario();

    await atualizarPerfil();

    await carregarPosts();
}

iniciar();

