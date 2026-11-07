
import { useState, useEffect } from 'react';
import './LoteEmUso.css';

function LoteEmUso() {

    const [lotes, setLotes] = useState([]);

    useEffect(() => {

        fetch('http://localhost:3000/relatorios/lote-em-uso')

            .then(resposta => resposta.json())

            .then(dados => {
                setLotes(dados);
            })

            .catch(erro => {
                console.log('Erro ao buscar lote em uso:', erro);
            });

    }, []);

    function formatarData(data) {

        const dataSemHora = data.split('T')[0];

        const partes = dataSemHora.split('-');

        return partes[2] + '/' + partes[1] + '/' + partes[0];

    }

    return (
        <div className="cartao-lote-uso">

            <h3>Lote em Uso</h3>

            <table>

                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Lote em uso</th>
                        <th>Validade</th>
                        <th>Última saída</th>
                    </tr>
                </thead>

                <tbody>

                    {lotes.map((item) => (

                        <tr key={item.lote + item.produto}>

                            <td>{item.produto}</td>

                            <td>{item.lote}</td>

                            <td>{formatarData(item.validade)}</td>

                            <td>
                                {new Date(item.ultima_saida).toLocaleString('pt-BR')}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default LoteEmUso;
