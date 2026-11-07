
import './Cabecalho.css';

function Cabecalho({ paginaAtiva, setPaginaAtiva }) {
    return (
        <header>
            <h1>EstoqueLab</h1>

            <nav>
                <a
                    href="#"
                    onClick={() => setPaginaAtiva('Home')}
                    className={paginaAtiva === 'Home' ? 'ativo' : ''}
                >
                    Home
                </a>

                <a
                    href="#"
                    onClick={() => setPaginaAtiva('Cadastros')}
                    className={paginaAtiva === 'Cadastros' ? 'ativo' : ''}
                >
                    Cadastros
                </a>

                <a
                    href="#"
                    onClick={() => setPaginaAtiva('Relatorios')}
                    className={paginaAtiva === 'Relatorios' ? 'ativo' : ''}
                >
                    Relatórios
                </a>

                <a
                    href="#"
                    onClick={() => setPaginaAtiva('Ajustes')}
                    className={paginaAtiva === 'Ajustes' ? 'ativo' : ''}
                >
                    Ajustes
                </a>
            </nav>
        </header>
    );
}

export default Cabecalho;
