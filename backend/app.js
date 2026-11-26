const express = require("express");
const cors = require("cors");
const connection = require("./db");

const server = express();
server.use(cors());
server.use(express.json());

const CHAVE = "chave123"; //  a mesma usada no aes_encrypt do script SQL

//LOGIN
server.post("/login", (req, res) => {
  const { login, senha } = req.body;

  const sql =
    "SELECT id, nome, login FROM usuarios WHERE login = ? AND senha = SHA2(?, 256)";

  connection.query(sql, [login, senha], (erro, resultados) => {
    if (erro)
      return res.status(500).json({ sucesso: false, mensagem: erro.message });

    if (resultados.length === 0) {
      return res.json({ sucesso: false, mensagem: "login ou senha invalidos" });
    }
    res.json({ sucesso: true, usuario: resultados[0] });
  });
});
// nas etapas 6,7,8 novas rotas entram aqui
//etapa 6
//6.1 listar todos
server.get("/Responsavel", (req, res) => {
  const sql =
    "SELECT id_responsavel, Responsavel, email, telefone FROM Responsavel";

  connection.query(sql, (erro, resultados) => {
    if (erro)
      return res.status(500).json({ sucesso: false, mensagem: erro.message });
    res.json(resultados);
  });
});

// 6.1b buscar por termo (declarar ANTES de /responsavel/:id)
server.get("/responsavel/busca/:termo", (req, res) => {
  const sql =
    "SELECT id_responsavel, Responsavel, email, telefone FROM Responsavel WHERE Responsavel LIKE ? OR email Like ? or telefone LIKE ? ORDER BY Responsavel";

  connection.query(
    sql,
    [
      "%" + req.params.termo + "%",
      "%" + req.params.termo + "%",
      "%" + req.params.termo + "%",
    ],
    (erro, resultados) => {
      if (erro) return res.status(500).json({ mensagem: erro.message });
      res.json(resultados);
    },
  );
});

//6.1c buscar por id
server.get("/responsavel/:id", (req, res) => {
  const sql = `SELECT id_responsavel, Responsavel, CAST(AES_DECRYPT(cpf, ?) AS CHAR) AS cpf, email, telefone FROM Responsavel WHERE id_responsavel = ?`;

  connection.query(sql, [CHAVE, req.params.id], (erro, resultados) => {
    if (erro) return res.status(500).json({ mensagem: erro.message });
    res.json(resultados[0]);
  });
});

//6.1d cadastar, criptografia e cpf repetido
server.post("/responsavel", (req, res) => {
  const { Responsavel, CPF, email, telefone } = req.body;

  const sql =
    "INSERT INTO Responsavel (Responsavel, CPF, email, telefone) VALUES (?, AES_ENCRYPT(?, ?), ?, ?)";

  connection.query(
    sql,
    [Responsavel, CPF, CHAVE, email, telefone],
    (erro, resultado) => {
      if (erro) {
        if (erro.code == "ER_DUP_ENTRY") {
          return res.status(400).json({ mensagem: "CPF já cadastrado." });
        }
        return res.status(500).json({ mensagem: erro.message });
      }
      res.json({
        mensagem: "Responsavel cadastrado com sucesso!",
        id: resultado.insertId,
      });
    },
  );
});

//6.1e Editar
server.put("/Responsavel/:id", (req, res) => {
  const { Responsavel, CPF, email, telefone } = req.body;

  const sql = `UPDATE Responsavel SET Responsavel = ?, CPF = AES_ENCRYPT(?, ?), email = ?, telefone = ? WHERE id_responsavel = ?`;

  connection.query(
    sql,
    [Responsavel, CPF, CHAVE, email, telefone, req.params.id],
    (erro) => {
      if (erro) return res.status(500).json({ mensagem: erro.message });
      res.json({ mensagem: "Responsavel atualizado com sucesso." });
    },
  );
});

//6.1f Excluir
server.delete("/Responsavel/:id", (req, res) => {
  connection.query(
    "DELETE FROM Responsavel WHERE id_responsavel = ?",
    [req.params.id],
    (erro) => {
      if (erro) {
        if (erro.code == "ER_ROW_IS_REFERENCED_2") {
          return res
            .status(400)
            .json({
              mensagem: "Responsável possui filhos e não pode ser excluído.",
            });
        }

        return res.status(500).json({ mensagem: erro.message });
      }
      res.json({ mensagem: "Responsável removido com sucesso." });
    },
  );
});

//etapa 7
//7.1 cadastrar filho ligado a um responsavel
server.post("/filhos", (req, res) => {
  const { id_responsavel, Nome, dataNascimento, nivelNatacao } = req.body;

  if (!id_responsavel) {
    return res
      .status(400)
      .json({ mensagem: "O filho deve ser associado a um responsável." });
  }

  const sql =
    "INSERT INTO Filho (id_responsavel, Nome, dataNascimento, nivelNatacao) VALUES (?, ?, ?, ?)";

  connection.query(
    sql,
    [id_responsavel, Nome, dataNascimento, nivelNatacao],
    (erro, resultado) => {
      if (erro) return res.status(500).json({ mensagem: erro.message });
      res.json({
        mensagem: "Filho cadastrado com sucesso!",
        id: resultado.insertId,
      });
    },
  );
});

//etapa 8
//8.1a listar agendamentos juntando 3 tabelas e ordenando por data
server.get("/agendamentos", (req, res) => {
  const sql = `
        SELECT a.id_agendamentos, a.nomeProfessor, a.dataEhorario,
               f.Nome AS filho_nome, f.dataNascimento AS filho_nascimento, f.nivelNatacao AS filho_nivel,
               r.Responsavel AS responsavel_nome, CAST(AES_DECRYPT(r.CPF, ?) AS CHAR) AS responsavel_cpf,
               r.email AS responsavel_email, r.telefone AS responsavel_telefone
        FROM Agendamentos a
        INNER JOIN Filho f ON f.id_filho = a.id_filho
        INNER JOIN Responsavel r ON r.id_responsavel = f.id_responsavel
        ORDER BY a.dataEhorario
    `;

  connection.query(sql, [CHAVE], (erro, resultados) => {
    if (erro) return res.status(500).json({ mensagem: erro.message });
    res.json(resultados);
  });
});

//8.1b trazer um agendamento e alterar a data
server.get("/agendamentos/:id", (req, res) => {
  connection.query(
    "SELECT * FROM Agendamentos WHERE id_agendamentos = ?",
    [req.params.id],
    (erro, resultados) => {
      if (erro) return res.status(500).json({ mensagem: erro.message });
      res.json(resultados[0]);
    },
  );
});

server.put("/agendamentos/:id", (req, res) => {
  const { dataEhorario } = req.body;

  const sql =
    "UPDATE Agendamentos SET dataEhorario = ? WHERE id_agendamentos = ?";

  connection.query(sql, [dataEhorario, req.params.id], (erro) => {
    if (erro) return res.status(500).json({ mensagem: erro.message });
    res.json({ mensagem: "Data atualizada com sucesso." });
  });
});

//serivdor
const PORT = 3025;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
