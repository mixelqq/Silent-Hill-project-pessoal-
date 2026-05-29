async function carregarUsuario() {
  const res = await fetch("/usuario");
  const usuario = await res.json();

  if (!usuario) {
    document.getElementById("email-usuario").innerText = "Não logado";
    return;
  }

  document.getElementById("email-usuario").innerText = usuario.email;
  // caminho corrigido: pasta é "avatar" (singular)
  document.getElementById("avatar").src = "avatar/" + usuario.avatar;

  if (usuario.role === "admin") {
    document.getElementById("painel-admin").style.display = "block";
  }
}

async function uploadAvatar() {
  const input = document.getElementById("avatarInput");
  if (!input.files.length) return alert("Selecione uma imagem");

  const formData = new FormData();
  formData.append("avatar", input.files[0]);

  try {
    const res = await fetch("/upload-avatar", { method: "POST", body: formData });
    const data = await res.json(); // corrigido: backend responde JSON

    if (data.erro) {
      alert(data.erro);
    } else {
      alert(data.sucesso);
      document.getElementById("avatar").src = "avatar/" + data.avatar;
    }
  } catch (err) {
    alert("Erro ao enviar avatar");
  }
}

async function logout() {
  await fetch("/logout");
  window.location.href = "login.html";
}

async function carregarPosts() {
  const res = await fetch("/posts");
  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      <h3>${post.titulo}</h3>
      <p>${post.mensagem}</p>
      <small>Autor: ${post.autor}</small><br>
      <button onclick="curtirPost(${post.id})">Curtir</button>
      <span id="curtidas-${post.id}">${post.curtidas}</span>
    `;
    container.appendChild(div);
  });
}

async function criarPost() {
  const titulo = document.getElementById("titulo").value;
  const mensagem = document.getElementById("mensagem").value;

  const res = await fetch("/criar-post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, mensagem })
  });

  const msg = await res.text();
  alert(msg);
  carregarPosts();
}

async function curtirPost(id) {
  const res = await fetch(`/curtir/${id}`, { method: "POST" });
  const data = await res.json();
  document.getElementById(`curtidas-${id}`).innerText = data.curtidas;
}

carregarUsuario();
carregarPosts();

