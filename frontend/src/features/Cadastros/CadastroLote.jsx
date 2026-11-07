
import { useState, useEffect } from 'react';
import './CadastroLote.css';

function CadastroLote() {

    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');

    const [numeroLote, setNumeroLote] = useState('');
    const [fabricante, setFabricante] = useState('');
    const [validade, setValidade] = useState('');
    const [quantidade, setQuantidade] = useState('');

    useEffect(() => {

        fetch('http://localhost:3000/produtos')
            .then(resposta => resposta.json())
            .then(dados => {
                setProdutos(dados);
            })
            .catch(erro => {
                console.log('Erro ao buscar produtos:', erro);
            });

    }, []);

    function cadastrarLote(evento) {

        evento.preventDefault();

        const partesData = validade.split('/');

        if (partesData.length !== 3) {
            alert('Informe a validade no formato DD/MM/AAAA.');
            return;
        }

        const validadeBanco = partesData[2] + '-' + partesData[1] + '-' + partesData[0];

        const lote = {
            produto_id: produtoSelecionado,
            lote: numeroLote,
            fabricante: fabricante,
            validade: validadeBanco,
            quantidade: quantidade
        };

        fetch('http://localhost:3000/lotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lote)
        })
            .then(resposta => {
                if (!resposta.ok) {
                    throw new Error('Erro ao cadastrar lote');
                }

                return resposta.json();
            })
            .then(dados => {

                alert(dados.mensagem);

                setNumeroLote('');
                setProdutoSelecionado('');
                setFabricante('');
                setValidade('');
                setQuantidade('');

            })
            .catch(erro => {
                alert('Não foi possível cadastrar o lote.');
                console.log(erro);
            });
    }

    return (
        <div className="cartao-lote">

            <h3>Cadastro de Lote</h3>

            <form onSubmit={cadastrarLote}>

                <div className="campo">
                    <label>Número do lote</label>
                    <input
                        type="text"
                        placeholder="Digite o número do lote"
                        value={numeroLote}
                        onChange={(evento) => setNumeroLote(evento.target.value)}
                        required
                    />
                </div>

                <div className="campo">
                    <label>Produto</label>

                    <select
                        value={produtoSelecionado}
                        onChange={(evento) => setProdutoSelecionado(evento.target.value)}
                        required
                    >
                        <option value="">Selecione o produto</option>

                        {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                                {produto.nome}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="campo">
                    <label>Fabricante</label>
                    <input
                        type="text"
                        placeholder="Digite o fabricante"
                        value={fabricante}
                        onChange={(evento) => setFabricante(evento.target.value)}
                        required
                    />
                </div>

                <div className="campo">
                    <label>Validade</label>
                    <input
                        type="text"
                        placeholder="DD/MM/AAAA"
                        value={validade}
                        onChange={(evento) => setValidade(evento.target.value)}
                        required
                    />
                </div>

                <div className="campo">
                    <label>Quantidade</label>
                    <input
                        type="number"
                        placeholder="Informe a quantidade"
                        value={quantidade}
                        onChange={(evento) => setQuantidade(evento.target.value)}
                        required
                    />
                </div>

                <button type="submit">Cadastrar lote</button>

            </form>

        </div>
    );
}

export default CadastroLote;
