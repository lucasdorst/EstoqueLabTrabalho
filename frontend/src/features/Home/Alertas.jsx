
import { useState, useEffect } from 'react';
import './Alertas.css';

function Alertas({ atualizacao }) {

    const [alertas, setAlertas] = useState({
        validadeProxima: [],
        vencidos: [],
        estoqueMinimo: []
    });

    useEffect(() => {

        fetch('http://localhost:3000/alertas')
            .then(resposta => resposta.json())
            .then(dados => {
                setAlertas(dados);
            })
            .catch(erro => {
                console.log('Erro ao buscar alertas:', erro);
            });

    }, [atualizacao]);

    function formatarData(data) {

        const dataSemHora = data.split('T')[0];
        const partes = dataSemHora.split('-');

        return partes[2] + '/' + partes[1] + '/' + partes[0];

    }

    return (
        <div className="area-alertas">

            <h3>Alertas</h3>

            <div className="grupo-alertas">

                <h4>Validade próxima</h4>

                {alertas.validadeProxima.length === 0 ? (
                    <p>Nenhum lote próximo do vencimento.</p>
                ) : (

                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Lote</th>
                                <th>Quantidade</th>
                                <th>Validade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alertas.validadeProxima.map((item) => (
                                <tr key={item.lote + item.produto}>
                                    <td>{item.produto}</td>
                                    <td>{item.lote}</td>
                                    <td>{Number(item.quantidade)}</td>
                                    <td>{formatarData(item.validade)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}

            </div>

            <div className="grupo-alertas">

                <h4>Produtos vencidos</h4>

                {alertas.vencidos.length === 0 ? (
                    <p>Nenhum lote vencido.</p>
                ) : (

                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Lote</th>
                                <th>Quantidade</th>
                                <th>Validade</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alertas.vencidos.map((item) => (
                                <tr key={item.lote + item.produto}>
                                    <td>{item.produto}</td>
                                    <td>{item.lote}</td>
                                    <td>{Number(item.quantidade)}</td>
                                    <td>{formatarData(item.validade)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}

            </div>

            <div className="grupo-alertas">

                <h4>Estoque mínimo</h4>

                {alertas.estoqueMinimo.length === 0 ? (
                    <p>Nenhum produto no estoque mínimo.</p>
                ) : (

                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade total</th>
                                <th>Estoque mínimo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alertas.estoqueMinimo.map((item) => (
                                <tr key={item.produto}>
                                    <td>{item.produto}</td>
                                    <td>{Number(item.quantidade_total)}</td>
                                    <td>{Number(item.estoque_minimo)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                )}

            </div>

        </div>
    );
}

export default Alertas;
