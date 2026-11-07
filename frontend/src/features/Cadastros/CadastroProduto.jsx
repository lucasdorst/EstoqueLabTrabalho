
import { useState } from 'react';
import './CadastroProduto.css';

function CadastroProduto() {

    const [nome, setNome] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [estoqueMinimo, setEstoqueMinimo] = useState('');
    const [estoqueMaximo, setEstoqueMaximo] = useState('');

    function cadastrarProduto(evento) {
        evento.preventDefault();

        const produto = {
            nome: nome,
            unidade_medida: unidadeMedida,
            estoque_minimo: estoqueMinimo,
            estoque_maximo: estoqueMaximo
        };

        fetch('http://localhost:3000/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        })
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Erro ao cadastrar produto');
            }

            return resposta.json();
        })
        .then(dados => {
            alert(dados.mensagem);

            setNome('');
            setUnidadeMedida('');
            setEstoqueMinimo('');
            setEstoqueMaximo('');
        })
        .catch(erro => {
            alert('Não foi possível cadastrar o produto.');
            console.log(erro);
        });
    }

    return (
        <div className="cartao-produto">

            <h3>Cadastro de Produto</h3>

            <form onSubmit={cadastrarProduto}>

                <div className="campo">
                    <label>Nome do produto</label>
                    <input
                        type="text"
                        placeholder="Digite o nome do produto"
                        value={nome}
                        onChange={(evento) => setNome(evento.target.value)}
                        required
                    />
                </div>

                <div className="campo">
                    <label>Unidade de medida</label>
                    <input
                        type="text"
                        placeholder="Ex: mL, L, unidade"
                        value={unidadeMedida}
                        onChange={(evento) => setUnidadeMedida(evento.target.value)}
                        required
                    />
                </div>

                <div className="campo">
                    <label>Estoque mínimo</label>
                    <input
                        type="number"
                        placeholder="Informe o estoque mínimo"
                        value={estoqueMinimo}
                        onChange={(evento) => setEstoqueMinimo(evento.target.value)}
                        required
                    />
                </div>

                <div className="campo">
                    <label>Estoque máximo</label>
                    <input
                        type="number"
                        placeholder="Informe o estoque máximo"
                        value={estoqueMaximo}
                        onChange={(evento) => setEstoqueMaximo(evento.target.value)}
                        required
                    />
                </div>

                <button type="submit">Cadastrar produto</button>

            </form>

        </div>
    );
}

export default CadastroProduto;
