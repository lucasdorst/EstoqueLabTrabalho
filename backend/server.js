const express = require('express');
const conexao = require('./database');

const app = express();

app.get('/produtos', (req, res) => {
    conexao.query('SELECT * FROM produtos', (erro, resultados) => {
        if (erro) {
            res.status(500).send(erro);
            return;
        }

        res.json(resultados);
    });
});

app.use(express.json());

app.post('/produtos', (req, res) => {
    const { nome, unidade_medida, estoque_minimo, estoque_maximo } = req.body;

    const sql = `
        INSERT INTO produtos
        (nome, unidade_medida, estoque_minimo, estoque_maximo)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [nome, unidade_medida, estoque_minimo, estoque_maximo],
        (erro, resultado) => {
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            res.status(201).json({
                mensagem: 'Produto cadastrado com sucesso!',
                id: resultado.insertId
            });
        }
    );
});

app.get('/', (req, res) => {
    res.send('Sistema de Estoque funcionando!');
});

app.listen(3000, () => {
    console.log('Servidor funcionando na porta 3000');
});