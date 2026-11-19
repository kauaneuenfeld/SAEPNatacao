const express = require('express');
const cors = require('cors');
const connection = require('./db');

const server = express();
server.use(cors());
server.use(express.json());

const CHAVE = 'chave123'; //  a mesma usada no aes_encrypt do script SQL

//LOGIN
server.post('/login', (req, res) => {
    const { login, senha } = req.body;

    const sql = 'SELECT id, nome, login FROM usuarios WHERE login = ? AND senha = SHA2(?, 256)';

    connection.query(sql, [login, senha], (erro, resultados) => {
        if (erro) return res.status(500).json({sucesso: false,  mensagem: erro.mensagem });

        if (resultados.length === 0) {
            return res.json({sucesso: false, mensagem: 'login ou senha invalidos' })
        }
        res.json({sucesso: true, usuario: resultados[0] });
    })
})
// nas etapas 6,7,8 novas rotas entram aqui
//etapa 6
//6.1 listar todos
server.get('/Responsavel', (req, res) => {
    const sql = 'SELECT id_responsavel, Responsavel, email, telefone FROM Responsavel';

    connection.query(sql, (erro, resultados) => {
        if (erro) return res.status(500).json({ sucesso: false, mensagem: erro.mensagem });
        res.json(resultados);
    })
});

// 6.1b buscar por termo
server.get('/responsavel/buscar:termo', (req, res) => {
    const sql =
        'SELECT id_responsavel, Responsavel, email, telefone FROM Responsavel WHERE nome LIKE ? OR email Like ? or telefone LIKE ?';
    
    connection.query(sql, ['%' + req.params.termo + '%', '%' + req.params.termo + '%', '%' + req.params.termo + '%'], (erro, resultados) => {
        if (erro) return res.status(500).json({ mensagem: erro.mensagem });
        res.json(resultados);
    })
});

//6.1c buscar por id
server.get('/responsavel/:id', (req, res) => {
    const sql = `SELECT id_responsavel, Responsavel, CAST(AES_DECRYPT(cpf, ?) AS CHAR) AS cpf, email, telefone FROM Responsavel WHERE id_responsavel = ?`;

    connection.query(sql, [CHAVE, req.params.id], (erro, resultados) => {
        if(erro) return res.status(500).json({mensagem: erro.mensagem});
        res.json(resultados[0]);
    })
})



//serivdor
const PORT = 3025;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});