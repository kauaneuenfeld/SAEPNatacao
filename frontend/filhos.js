carregarResponsaveis();

// 7.3 preencher o select com os dados da API (value = id, texto = nome)
async function carregarResponsaveis() {
  const responsaveis = await buscarJson("/responsavel");
  const select = document.getElementById("id_responsavel");

  responsaveis.forEach((r) => {
    select.innerHTML += `<option value="${r.id_responsavel}">${r.Responsavel}</option>`;
  });
}

// 6.3b ler o formulário em um objeto (nomes iguais aos do req.body da API)
function lerCampos() {
  return {
    id_responsavel: document.getElementById("id_responsavel").value,
    Nome: document.getElementById("Nome").value,
    dataNascimento: document.getElementById("dataNascimento").value,
    nivelNatacao: document.getElementById("nivelNatacao").value,
  };
}

// 6.3c validar campos obrigatórios
const MENSAGENS = {
  id_responsavel: "Selecione o responsável.",
  Nome: "Informe o nome.",
  dataNascimento: "Informe a data de nascimento.",
  nivelNatacao: "Selecione o nível de natação.",
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

  if (await enviar("/filhos", "POST", dados)) {
    limparCampos();
  }
}

function limparCampos() {
  ["id_responsavel", "Nome", "dataNascimento", "nivelNatacao"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
}
