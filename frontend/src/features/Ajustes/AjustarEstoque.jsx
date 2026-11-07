
import { useState, useEffect } from 'react';
import './AjustarEstoque.css';

function AjustarEstoque() {

    const [produtos, setProdutos] = useState([]);
    const [lotes, setLotes] = useState([]);

    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [loteSelecionado, setLoteSelecionado] = useState('');

    const [quantidadeAtual, setQuantidadeAtual] = useState('');
    const [novaQuantidade, setNovaQuantidade] = useState('');
    const [motivo, setMotivo] = useState('');

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

    const lotesDisponiveis = lotes.filter((lote) => {
        return lote.produto_id === Number(produtoSelecionado);
    });

    function selecionarLote(id) {

        setLoteSelecionado(id);

        const loteEncontrado = lotes.find((lote) => {
            return lote.id === Number(id);
        });

        if (loteEncontrado) {
            setQuantidadeAtual(loteEncontrado.quantidade);
        }

    }

    function salvarAjuste(evento) {

        evento.preventDefault();

        const ajuste = {
            lote_id: loteSelecionado,
            nova_quantidade: novaQuantidade,
            motivo: motivo
        };

        fetch('http://localhost:3000/ajustes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ajuste)
        })

            .then(resposta => resposta.json().then(dados => {

                if (!resposta.ok) {
                    throw new Error(dados.mensagem);
                }

                return dados;

            }))

            .then(dados => {

                alert(dados.mensagem);

                setProdutoSelecionado('');
                setLoteSelecionado('');
                setQuantidadeAtual('');
                setNovaQuantidade('');
                setMotivo('');

                carregarLotes();

            })

            .catch(erro => {

                alert(erro.message);
                console.log(erro);

            });

    }

    return (
        <div className="cartao-ajuste">

            <h3>Ajustar Estoque</h3>

            <form onSubmit={salvarAjuste}>

                <div className="campo">
                    <label>Produto</label>

                    <select
                        value={produtoSelecionado}
                        onChange={(evento) => {
                            setProdutoSelecionado(evento.target.value);
                            setLoteSelecionado('');
                            setQuantidadeAtual('');
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
                        onChange={(evento) => selecionarLote(evento.target.value)}
                        disabled={!produtoSelecionado}
                        required
                    >
                        <option value="">Selecione o lote</option>

                        {lotesDisponiveis.map((lote) => (
                            <option key={lote.id} value={lote.id}>
                                {lote.lote}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="campo">
                    <label>Quantidade atual</label>

                    <input
                        type="number"
                        value={quantidadeAtual}
                        readOnly
                    />
                </div>

                <div className="campo">
                    <label>Nova quantidade</label>

                    <input
                        type="number"
                        placeholder="Informe a nova quantidade"
                        value={novaQuantidade}
                        onChange={(evento) => setNovaQuantidade(evento.target.value)}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="campo">
                    <label>Motivo do ajuste</label>

                    <select
                        value={motivo}
                        onChange={(evento) => setMotivo(evento.target.value)}
                        required
                    >
                        <option value="">Selecione o motivo</option>
                        <option value="Vencimento">Vencimento</option>
                        <option value="Contagem irregular">Contagem irregular</option>
                        <option value="Erro de usuário">Erro de usuário</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>

                <button type="submit">Salvar ajuste</button>

            </form>

        </div>
    );
}

export default AjustarEstoque;
