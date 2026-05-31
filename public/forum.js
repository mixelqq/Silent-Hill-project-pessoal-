async function carregarUsuario() {

  const res =
    await fetch("/usuario");

  const usuario =
    await res.json();

  if (!usuario) {

    document
    .getElementById(
      "email-usuario"
    )
    .innerText =
    "Não logado";

    return;
  }

  document
  .getElementById(
    "email-usuario"
  )
  .innerText =
  usuario.email;

  document
  .getElementById(
    "avatar"
  )
  .src =
  "/uploads/" +
  usuario.avatar;

  if (
    usuario.role ===
    "admin"
  ) {

    document
    .getElementById(
      "painel-admin"
    )
    .style.display =
    "block";
  }
}

async function criarPost() {

  const titulo =
    document
    .getElementById(
      "titulo"
    ).value;

  const mensagem =
    document
    .getElementById(
      "mensagem"
    ).value;

  const res =
    await fetch(
      "/criar-post",
      {
        method: "POST",
        headers: {
          "Content-Type":
          "application/json"
        },
        body: JSON.stringify({
          titulo,
          mensagem
        })
      }
    );

  const data =
    await res.json();

  if (data.erro) {

    alert(data.erro);

  } else {

    alert(data.sucesso);

    carregarPosts();
  }
}

async function carregarPosts() {

  const res =
    await fetch("/posts");

  const posts =
    await res.json();

  const container =
    document.getElementById(
      "posts"
    );

  container.innerHTML = "";

  posts.forEach(post => {

    const div =
      document.createElement(
        "div"
      );

    div.classList.add(
      "post"
    );

    div.innerHTML = `
      <h3>${post.titulo}</h3>
      <p>${post.mensagem}</p>
      <small>Autor: ${post.autor}</small><br>

      <button onclick="curtirPost(${post.id})">
        Curtir
      </button>

      <span id="curtidas-${post.id}">
        ${post.curtidas}
      </span>

      <button
        class="excluir"
        onclick="excluirPost(${post.id})"
      >
        Excluir
      </button>
    `;

    container.appendChild(div);

  });
}

async function curtirPost(id) {

  const res =
    await fetch(
      `/curtir/${id}`,
      {
        method: "POST"
      }
    );

  const data =
    await res.json();

  document
  .getElementById(
    `curtidas-${id}`
  )
  .innerText =
  data.curtidas;
}

async function excluirPost(id) {

  const res =
    await fetch(
      `/excluir/${id}`,
      {
        method: "DELETE"
      }
    );

  const data =
    await res.json();

  if (data.erro) {

    alert(data.erro);

  } else {

    alert(data.sucesso);

    carregarPosts();
  }
}

async function logout() {

  const res =
    await fetch(
      "/logout"
    );

  const data =
    await res.json();

  alert(data.sucesso);

  window.location.href =
    "login.html";
}

/* FOTO DE PERFIL */

document
.getElementById("trocarAvatar")
.addEventListener(
  "change",
  async function () {

    const arquivo = this.files[0];

    console.log("Arquivo selecionado:", arquivo);

    if (!arquivo) return;

    const formData = new FormData();

    formData.append(
      "avatar",
      arquivo
    );

    try {

      const resposta =
        await fetch(
          "/avatar",
          {
            method: "POST",
            body: formData
          }
        );

      console.log(
        "Status:",
        resposta.status
      );

      const dados =
        await resposta.json();

      console.log(
        "Resposta:",
        dados
      );

      if (dados.sucesso) {

        document
        .getElementById("avatar")
        .src =
        "/uploads/" +
        dados.avatar +
        "?" +
        Date.now();

      } else {

        alert(
          dados.erro
        );
      }

    } catch (erro) {

      console.log(erro);

      alert(
        "Erro ao enviar imagem"
      );
    }
  }
);

carregarUsuario();
carregarPosts();
