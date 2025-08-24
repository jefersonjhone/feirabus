import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from '../pages/home'
import Map from '../componentes/map'
import Mapa from '../pages/map.jsx'
//import Favoritos from './componentes/Favoritos/Favoritos';
//import PesquisarPorLinha from './componentes/Search/PesquisarPorLinha';
//import './App.css';
//import Acompanhar from './componentes/Acompanhar/Acompanhar';
//import CalcularRota from './componentes/CalcularRota.jsx';
import { Linhas } from '../pages/linhas.jsx'
import { Veiculos } from '../pages/veiculos.jsx'
import { Rotas } from '../pages/rotas.jsx'
import Favoritos from '../pages/favoritos.jsx'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*
            <Route path="/pesquisar-linha" element={<PesquisarPorLinha/>}/>
            <Route path="/favoritos" element={<Favoritos/>}/>
            <Route path="/calcular-rota" element={<CalcularRota/>}/>
            <Route path="/acompanhar/:linha" element={<Acompanhar/>}/>*/}

        <Route path="/explorar" element={<Mapa />} />
        <Route path="/map" element={<Map />} />
        <Route path="/linhas" element={<Linhas />} />
        <Route path="/rotas" element={<Rotas />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </Router>
  )
}
