
import { useState } from 'react';

import './Home.css';
import ConsumirProduto from '../features/Home/ConsumirProduto';
import Alertas from '../features/Home/Alertas';

function Home() {

    const [atualizacao, setAtualizacao] = useState(0);

    return (
        <div className="pagina-home">

            <div className="conteudo-home">

                <ConsumirProduto
                    onConsumoRegistrado={() => setAtualizacao(atualizacao + 1)}
                />

                <Alertas atualizacao={atualizacao} />

            </div>

        </div>
    );
}

export default Home;
