/* ==========================================================
   API DE USUÁRIOS
   - Se API_URL estiver vazio, usa a API simulada abaixo.
   - Para usar uma API real, coloque a URL, ex.:
     const API_URL = "http://localhost:3000/usuarios";
     A busca será enviada como  ?nome=texto
     e a resposta deve ser um JSON no formato:
     [{ "id": 1, "nome": "...", "login": "...", "logado": false }]
   ========================================================== */
const API_URL = "";

const USUARIOS_MOCK = [
  { id: 1, nome: "RICARDO DA SILVA ZANATA",       login: "RICKS",  logado: false },
  { id: 2, nome: "ALFREDO ALEXANDRE DE OLIVEIRA", login: "XANDAO", logado: false },
  { id: 3, nome: "JOÃO LUIS CHAGAS SANCHES",      login: "JOHNNY", logado: false },
  { id: 4, nome: "RICARDO AMORIM",                login: "AMORIM", logado: false }
];

// Remove acentos e deixa em minúsculas para a busca
const normalizar = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Função que "é" a API: retorna uma Promise com a lista de usuários
async function buscarUsuarios(nome = "") {
  if (API_URL) {
    const resp = await fetch(`${API_URL}?nome=${encodeURIComponent(nome)}`);
    if (!resp.ok) throw new Error("Erro HTTP " + resp.status);
    return resp.json();
  }

  // API simulada (com pequeno atraso, como numa chamada real)
  await new Promise(r => setTimeout(r, 300));
  const termo = normalizar(nome.trim());
  return USUARIOS_MOCK.filter(u => normalizar(u.nome).includes(termo));
}

const escapar = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderizar(usuarios) {
  const tbody = document.getElementById("tabela");
  document.getElementById("total").textContent = usuarios.length;

  if (usuarios.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-muted py-4">Nenhum usuário encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = usuarios.map(u => `
    <tr>
      <td>${escapar(u.id)}</td>
      <td>${escapar(u.nome)}</td>
      <td>${escapar(u.login)}</td>
      <td>${u.logado ? "SIM" : "NÃO"}</td>
    </tr>`).join("");
}

async function carregar() {
  const msg = document.getElementById("mensagem");
  msg.innerHTML = "";
  try {
    const usuarios = await buscarUsuarios(document.getElementById("busca").value);
    renderizar(usuarios);
  } catch (e) {
    msg.innerHTML = `<div class="alert alert-danger">Erro ao buscar usuários: ${escapar(e.message)}</div>`;
  }
}

document.getElementById("formBusca").addEventListener("submit", e => {
  e.preventDefault();
  carregar();
});

carregar(); // lista todos ao abrir a página
