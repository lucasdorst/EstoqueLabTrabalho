const express = require('express');
const conexao = require('./database');
const cors = require('cors');

const app = express();
app.use(cors());

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


app.post('/lotes', (req, res) => {

    const { produto_id, lote, fabricante, validade, quantidade } = req.body;

    const sql = `
        INSERT INTO lotes
        (produto_id, lote, fabricante, validade, quantidade)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [produto_id, lote, fabricante, validade, quantidade],
        (erro, resultado) => {

            if (erro) {
                res.status(500).send(erro);
                return;
            }

            res.status(201).json({
                mensagem: 'Lote cadastrado com sucesso!',
                id: resultado.insertId
            });

        }
    );

});


app.post('/movimentacoes', (req, res) => {

    const { lote_id, quantidade } = req.body;

    const sqlEstoque = `
        SELECT quantidade
        FROM lotes
        WHERE id = ?
    `;

    conexao.query(sqlEstoque, [lote_id], (erro, resultados) => {

        if (erro) {
            res.status(500).send(erro);
            return;
        }

        if (resultados.length === 0) {
            res.status(404).json({
                mensagem: 'Lote não encontrado.'
            });
            return;
        }

        const quantidadeAtual = Number(resultados[0].quantidade);
        const quantidadeConsumo = Number(quantidade);

        if (quantidadeConsumo <= 0 || quantidadeConsumo > quantidadeAtual) {
            res.status(400).json({
                mensagem: 'Quantidade de consumo inválida ou superior ao estoque disponível.'
            });
            return;
        }

        const sqlMovimentacao = `
            INSERT INTO movimentacoes (lote_id, quantidade)
            VALUES (?, ?)
        `;

        conexao.query(
            sqlMovimentacao,
            [lote_id, quantidadeConsumo],
            (erro) => {

                if (erro) {
                    res.status(500).send(erro);
                    return;
                }

                const sqlAtualizarEstoque = `
                    UPDATE lotes
                    SET quantidade = quantidade - ?
                    WHERE id = ?
                `;

                conexao.query(
                    sqlAtualizarEstoque,
                    [quantidadeConsumo, lote_id],
                    (erro) => {

                        if (erro) {
                            res.status(500).send(erro);
                            return;
                        }

                        res.status(201).json({
                            mensagem: 'Consumo registrado com sucesso!'
                        });

                    }
                );

            }
        );

    });

});


app.get('/lotes', (req, res) => {

    conexao.query('SELECT * FROM lotes', (erro, resultados) => {

        if (erro) {
            res.status(500).send(erro);
            return;
        }

        res.json(resultados);

    });

});


app.get('/alertas', (req, res) => {

    const sqlValidadeProxima = `
        SELECT
            p.nome AS produto,
            l.lote,
            l.quantidade,
            l.validade
        FROM lotes l
        INNER JOIN produtos p ON l.produto_id = p.id
        WHERE l.validade >= CURDATE()
        AND l.validade <= DATE_ADD(CURDATE(), INTERVAL 60 DAY)
        AND l.quantidade > 0
        ORDER BY l.validade
    `;

    const sqlVencidos = `
        SELECT
            p.nome AS produto,
            l.lote,
            l.quantidade,
            l.validade
        FROM lotes l
        INNER JOIN produtos p ON l.produto_id = p.id
        WHERE l.validade < CURDATE()
        AND l.quantidade > 0
        ORDER BY l.validade
    `;

    const sqlEstoqueMinimo = `
        SELECT
            p.nome AS produto,
            p.estoque_minimo,
            COALESCE(SUM(l.quantidade), 0) AS quantidade_total
        FROM produtos p
        LEFT JOIN lotes l ON p.id = l.produto_id
        GROUP BY p.id, p.nome, p.estoque_minimo
        HAVING quantidade_total <= p.estoque_minimo
    `;

    conexao.query(sqlValidadeProxima, (erro, validadeProxima) => {

        if (erro) {
            res.status(500).send(erro);
            return;
        }

        conexao.query(sqlVencidos, (erro, vencidos) => {

            if (erro) {
                res.status(500).send(erro);
                return;
            }

            conexao.query(sqlEstoqueMinimo, (erro, estoqueMinimo) => {

                if (erro) {
                    res.status(500).send(erro);
                    return;
                }

                res.json({
                    validadeProxima: validadeProxima,
                    vencidos: vencidos,
                    estoqueMinimo: estoqueMinimo
                });

            });

        });

    });

});


app.get('/relatorios/saldo', (req, res) => {

    const sql = `
        SELECT
            p.nome AS produto,
            l.lote,
            l.validade,
            l.quantidade,
            p.unidade_medida
        FROM lotes l
        INNER JOIN produtos p ON l.produto_id = p.id
        ORDER BY p.nome, l.validade
    `;

    conexao.query(sql, (erro, resultados) => {

        if (erro) {
            res.status(500).send(erro);
            return;
        }

        res.json(resultados);

    });

});


app.get('/relatorios/lote-em-uso', (req, res) => {

    const sql = `
        SELECT
            p.nome AS produto,
            l.lote,
            l.validade,
            m.data_hora AS ultima_saida
        FROM produtos p
        INNER JOIN lotes l ON l.produto_id = p.id
        INNER JOIN movimentacoes m ON m.lote_id = l.id
        WHERE m.id = (
            SELECT m2.id
            FROM movimentacoes m2
            INNER JOIN lotes l2 ON l2.id = m2.lote_id
            WHERE l2.produto_id = p.id
            ORDER BY m2.data_hora DESC, m2.id DESC
            LIMIT 1
        )
        ORDER BY p.nome
    `;

    conexao.query(sql, (erro, resultados) => {

        if (erro) {
            res.status(500).send(erro);
            return;
        }

        res.json(resultados);

    });

});



app.post('/ajustes', (req, res) => {

    const { lote_id, nova_quantidade, motivo } = req.body;

    const quantidadeNova = Number(nova_quantidade);

    if (!lote_id || !Number.isFinite(quantidadeNova) || quantidadeNova < 0 || !motivo) {
        res.status(400).json({
            mensagem: 'Informe o lote, uma quantidade válida e o motivo do ajuste.'
        });
        return;
    }

    const sqlConsultar = `
        SELECT quantidade
        FROM lotes
        WHERE id = ?
    `;

    conexao.query(sqlConsultar, [lote_id], (erro, resultados) => {

        if (erro) {
            res.status(500).send(erro);
            return;
        }

        if (resultados.length === 0) {
            res.status(404).json({
                mensagem: 'Lote não encontrado.'
            });
            return;
        }

        const quantidadeAnterior = Number(resultados[0].quantidade);

        const sqlAjuste = `
            INSERT INTO ajustes
            (lote_id, quantidade_anterior, quantidade_nova, motivo)
            VALUES (?, ?, ?, ?)
        `;

        conexao.query(
            sqlAjuste,
            [lote_id, quantidadeAnterior, quantidadeNova, motivo],
            (erro) => {

                if (erro) {
                    res.status(500).send(erro);
                    return;
                }

                const sqlAtualizar = `
                    UPDATE lotes
                    SET quantidade = ?
                    WHERE id = ?
                `;

                conexao.query(
                    sqlAtualizar,
                    [quantidadeNova, lote_id],
                    (erro) => {

                        if (erro) {
                            res.status(500).send(erro);
                            return;
                        }

                        res.json({
                            mensagem: 'Ajuste realizado com sucesso!'
                        });

                    }
                );

            }
        );

    });

});


app.listen(3000, () => {
    console.log('Servidor funcionando na porta 3000');
});