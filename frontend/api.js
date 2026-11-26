const API = "http://localhost:3025";

// Get busca os dados e devolver o json
async function buscarJson(caminho) {
  const resposta = await fetch(API + caminho);
  return resposta.json();
}

//POST/PUT/DELETE envia os dados e devolve {ok, dados}
async function enviarJson(caminho, metodo, dados) {
  const opcoes = { method: metodo };

  if (dados) {
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(dados);
  }

  const resposta = await fetch(API + caminho, opcoes);
  return { ok: resposta.ok, dados: await resposta.json() };
}

//igaul enviarJson, mas ja mostra a mensgame do servidor
async function enviar(caminho, metodo, dados) {
  const { ok, dados: json } = await enviarJson(caminho, metodo, dados);
  alert(json.mensagem);
  return ok;
}
