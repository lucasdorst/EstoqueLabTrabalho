
import { useState } from 'react';

import Cabecalho from './components/Cabecalho';

import Home from './pages/Home';
import Cadastros from './pages/Cadastros';
import Relatorios from './pages/Relatorios';
import Ajustes from './pages/Ajustes';

function App() {
    const [paginaAtiva, setPaginaAtiva] = useState('Home');

    return (
        <div>
            <Cabecalho
                paginaAtiva={paginaAtiva}
                setPaginaAtiva={setPaginaAtiva}
            />

            {paginaAtiva === 'Home' && <Home />}
            {paginaAtiva === 'Cadastros' && <Cadastros />}
            {paginaAtiva === 'Relatorios' && <Relatorios />}
            {paginaAtiva === 'Ajustes' && <Ajustes />}
        </div>
    );
}

export default App;
