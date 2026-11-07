
import { useState, useEffect } from 'react';
import './ConsumirProduto.css';

function ConsumirProduto({ onConsumoRegistrado }) {

    const [produtos, setProdutos] = useState([]);
    const [lotes, setLotes] = useState([]);

    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [loteSelecionado, setLoteSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState('');

    function carregarLotes() {

        fetch('http://localhost:3000/lotes')
            .then(resposta => resposta.json())
            .then(dados => {
                setLotes(dados);
            })
            .catch(erro => {
                console.log('Erro ao buscar lotes:', erro);
            });

    }

    useEffect(() => {

        fetch('http://localhost:3000/produtos')
            .then(resposta => resposta.json())
            .then(dados => {
                setProdutos(dados);
            })
            .catch(erro => {
                console.log('Erro ao buscar produtos:', erro);
            });

        carregarLotes();

    }, []);

    const lotesDisponiveis = lotes.filter((lote) => {
        return lote.produto_id === Number(produtoSelecionado)
            && Number(lote.quantidade) > 0;
    });

    function registrarConsumo(evento) {

        evento.preventDefault();

        const movimentacao = {
            lote_id: loteSelecionado,
            quantidade: quantidade
        };

        fetch('http://localhost:3000/movimentacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movimentacao)
        })

            .then(resposta => resposta.json().then(dados => {

                if (!resposta.ok) {
                    throw new Error(dados.mensagem);
                }

                return dados;

            }))

            .then(dados => {

                alert(dados.mensagem);
                onConsumoRegistrado();

                setProdutoSelecionado('');
                setLoteSelecionado('');
                setQuantidade('');

                carregarLotes();

            })

            .catch(erro => {

                alert(erro.message);
                console.log(erro);

            });

    }

    return (
        <div className="cartao-consumo">

            <h3>Consumir Produto</h3>

            <form onSubmit={registrarConsumo}>

                <div className="campo">
                    <label>Produto</label>

                    <select
                        value={produtoSelecionado}
                        onChange={(evento) => {
                            setProdutoSelecionado(evento.target.value);
                            setLoteSelecionado('');
                        }}
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
                    <label>Lote</label>

                    <select
                        value={loteSelecionado}
                        onChange={(evento) => setLoteSelecionado(evento.target.value)}
                        disabled={!produtoSelecionado}
                        required
                    >
                        <option value="">Selecione o lote</option>

                        {lotesDisponiveis.map((lote) => (
                            <option key={lote.id} value={lote.id}>
                                {lote.lote} - Saldo: {lote.quantidade}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="campo">
                    <label>Quantidade a consumir</label>

                    <input
                        type="number"
                        placeholder="Informe a quantidade"
                        value={quantidade}
                        onChange={(evento) => setQuantidade(evento.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                <button type="submit">Registrar consumo</button>

            </form>

        </div>
    );
}

export default ConsumirProduto;
