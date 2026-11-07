
import { useState, useEffect } from 'react';
import './SaldoEstoque.css';

function SaldoEstoque() {

    const [lotes, setLotes] = useState([]);

    useEffect(() => {

        fetch('http://localhost:3000/relatorios/saldo')

            .then(resposta => resposta.json())

            .then(dados => {
                setLotes(dados);
            })

            .catch(erro => {
                console.log('Erro ao buscar saldo de estoque:', erro);
            });

    }, []);

    function formatarData(data) {

        const dataSemHora = data.split('T')[0];

        const partes = dataSemHora.split('-');

        return partes[2] + '/' + partes[1] + '/' + partes[0];

    }

    return (
        <div className="cartao-saldo">

            <h3>Saldo de Estoque</h3>

            <table>

                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Lote</th>
                        <th>Validade</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>

                <tbody>

                    {lotes.map((item) => (

                        <tr key={item.lote + item.produto}>

                            <td>{item.produto}</td>

                            <td>{item.lote}</td>

                            <td>{formatarData(item.validade)}</td>

                            <td>{item.quantidade}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default SaldoEstoque;
