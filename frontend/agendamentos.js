listar(); // carrega a tabela assim que a página abre

async function listar() {
  montarTabela(await buscarJson("/agendamentos"));
}

function montarTabela(lista) {
  document.getElementById("tabela").innerHTML = lista
    .map(
      (item) => `
        <tr>
            <td>${item.id_agendamentos}</td>
            <td>${item.nomeProfessor}</td>
            <td>${formatarData(item.dataEhorario)}</td>
            <td>${formatarHora(item.dataEhorario)}</td>
            <td>${item.filho_nome}</td>
            <td>${formatarData(item.filho_nascimento)}</td>
            <td>${item.filho_nivel}</td>
            <td>${item.responsavel_nome}</td>
            <td>${mascararCpf(item.responsavel_cpf)}</td>
            <td>${item.responsavel_email}</td>
            <td>${item.responsavel_telefone}</td>
            <td>
                <button onclick="editarData(${item.id_agendamentos})">Alterar data</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// 8.3a formatar data, hora e mascarar CPF
// "2026-11-18 09:30:00"  →  "18/11/2026"
function formatarData(data) {
  const [ano, mes, dia] = data.substring(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

// "2026-11-18 09:30:00"  →  "09:30"
function formatarHora(dataEhorario) {
  return dataEhorario.substring(11, 16);
}

// "111.222.333-44"  →  "***.222.333-**"   (LGPD)
function mascararCpf(cpf) {
  return cpf ? "***" + cpf.substring(3, 11) + "-**" : "";
}

// 8.3b alterar a data (a coluna dataEhorario guarda data e hora juntas)
async function editarData(id) {
  const atual = await buscarJson(`/agendamentos/${id}`);

  const data = prompt(
    "Nova data (AAAA-MM-DD)",
    atual.dataEhorario.substring(0, 10),
  );
  if (data == null) return;

  const horario = prompt(
    "Horário (HH:MM)",
    atual.dataEhorario.substring(11, 16),
  );
  if (horario == null) return;

  await enviar(`/agendamentos/${id}`, "PUT", {
    dataEhorario: `${data} ${horario}:00`,
  });
  listar(); // a lista volta ordenada pelo servidor
}
