const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lukario00!',
    database: 'estoquelab'
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Erro ao conectar ao MySQL:', erro);
        return;
    }

    console.log('Conectado ao banco de dados!');
});

module.exports = conexao;