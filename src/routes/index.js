import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from '../pages/home'
import Map from '../componentes/map'
import Mapa from '../pages/map.jsx'
//import Favoritos from './componentes/Favoritos/Favoritos';
//import PesquisarPorLinha from './componentes/Search/PesquisarPorLinha';
//import './App.css';
//import Acompanhar from './componentes/Acompanhar/Acompanhar';
//import CalcularRota from './componentes/CalcularRota.jsx';
import { Linhas } from '../pages/linhas/index'
import { Veiculos } from '../pages/veiculos.jsx'
import { Rotas } from '../pages/rotas.jsx'
import Favoritos from '../pages/favoritos.jsx'
import ParadasProximas from '../pages/paradas-proximas.jsx'
import { LineDetail } from '../pages/linhas/linha.id'
import { Paradas } from '../pages/paradas'
import { StopDetail } from '../pages/paradas/parada.id'
import NotFound from '../pages/not-found'
import Toast from '../componentes/toast'
import FeedbackModal from '../componentes/feedback-modal'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Mapa />} />
        <Route path="/map" element={<Map />} />
        <Route path="/linhas" element={<Linhas />} />
        <Route path="/linhas/:cod" element={<LineDetail />} />
        <Route path="/paradas" element={<Paradas />} />
        <Route path="/paradas/:cod" element={<StopDetail />} />
        <Route path="/rotas" element={<Rotas />} />
        <Route path="/rotas/:origem/:destino" element={<Rotas />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/paradas-proximas" element={<ParadasProximas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toast />
      <FeedbackModal />
    </Router>
  )
}
