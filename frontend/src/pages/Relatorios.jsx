
import './Relatorios.css';

import SaldoEstoque from '../features/Relatorios/SaldoEstoque';
import LoteEmUso from '../features/Relatorios/LoteEmUso';

function Relatorios() {
    return (
        <div className="pagina-relatorios">

            <div className="conteudo-relatorios">

                <SaldoEstoque />

                <LoteEmUso />

            </div>

        </div>
    );
}

export default Relatorios;
