import { Helmet } from 'react-helmet'
import Navbar from '../componentes/navbar'


export default function Favoritos() {
  const fav = localStorage.getItem('favoritos')
  
  
  return (<>
    <Helmet>
      <title>FeiraBus - Seu guia de ônibus de Feira de Santana</title>
      <meta
        name="description"
        content="Consulte horários, itinerários, paradas e linhas do transporte coletivo de Feira de Santana - Bahia. Encontre o próximo ônibus em tempo real e planeje sua rota pela cidade com rapidez e praticidade."
      />
    </Helmet>
    <div className="h-screen">
      <Navbar page={'Favoritos'} />
      <div className='max-w-[1200px] mx-auto flex items-center justify-center text-base font-medium' >
        {fav?fav:"Você ainda não tem favoritos"}
      </div>
    </div>
  </>)
}
