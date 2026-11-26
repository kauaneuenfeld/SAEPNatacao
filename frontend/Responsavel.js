listar(); // carrega a tabela assim que a página abre

// 6.3a listar em uma tabela
async function listar() {
  montarTabela(await buscarJson("/responsavel"));
}

function montarTabela(lista) {
  document.getElementById("tabela").innerHTML = lista
    .map(
      (item) => `
        <tr>
            <td>${item.id_responsavel}</td>
            <td>${item.Responsavel}</td>
            <td>${item.email}</td>
            <td>
                <button onclick="editar(${item.id_responsavel})">Editar</button>
                <button onclick="excluir(${item.id_responsavel})">Excluir</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// 6.3b ler o formulário em um objeto (nomes iguais aos do req.body da API)
function lerCampos() {
  return {
    Responsavel: document.getElementById("nome").value,
    CPF: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
  };
}

// 6.3c validar campos obrigatórios
const MENSAGENS = {
  Responsavel: "Informe o nome.",
  CPF: "Informe o CPF.",
  email: "Informe o e-mail.",
  telefone: "Informe o telefone.",
};

function camposValidos(dados) {
  for (const campo in MENSAGENS) {
    if (dados[campo] == "") {
      alert(MENSAGENS[campo]);
      return false;
    }
  }
  return true;
}

// 6.3d cadastrar e limpar
async function cadastrar() {
  const dados = lerCampos();
  if (!camposValidos(dados)) return;

  if (await enviar("/responsavel", "POST", dados)) {
    limparCampos();
    listar();
  }
}

function limparCampos() {
  ["nome", "cpf", "email", "telefone"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
}

// 6.3e buscar com botão de confirmação
async function pesquisar() {
  const termo = document.getElementById("busca").value;

  if (termo == "") {
    listar();
    return;
  }

  const lista = await buscarJson(`/responsavel/busca/${termo}`);
  if (lista.length == 0) alert("Nenhum registro encontrado.");
  montarTabela(lista);
}

// 6.3f editar com prompt
async function editar(id) {
  const atual = await buscarJson(`/responsavel/${id}`); // dados atuais

  const nome = prompt("Nome", atual.Responsavel);
  if (nome == null) return; // clicou em Cancelar

  const cpf = prompt("CPF", atual.cpf);
  if (cpf == null) return;

  const email = prompt("E-mail", atual.email);
  if (email == null) return;

  const telefone = prompt("Telefone", atual.telefone);
  if (telefone == null) return;

  await enviar(`/responsavel/${id}`, "PUT", {
    Responsavel: nome,
    CPF: cpf,
    email,
    telefone,
  });
  listar();
}

// 6.3g excluir com confirmação
async function excluir(id) {
  if (!confirm("Deseja excluir este registro?")) return;

  await enviar(`/responsavel/${id}`, "DELETE");
  listar();
}
