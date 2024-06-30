import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './componentes/Home';
import Mapa from './componentes/Mapa';
import PesquisarPorLinha from './componentes/PesquisarPorLinha';
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/Encontrar-no-Mapa" element={<Mapa/>}/>
                <Route path="/Pesquisar-por-linha" element={<PesquisarPorLinha/>}/>
            </Routes>
   </Router>)
}

export default App;
