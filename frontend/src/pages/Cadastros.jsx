
import './Cadastros.css';

import CadastroProduto from '../features/Cadastros/CadastroProduto';
import CadastroLote from '../features/Cadastros/CadastroLote';

function Cadastros() {
    return (
        <div className="pagina-cadastros">

            <div className="conteudo-cadastros">

                <CadastroProduto />

                <CadastroLote />

            </div>

        </div>
    );
}

export default Cadastros;
