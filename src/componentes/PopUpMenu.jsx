import Proximos from "./PopUpPontos/Proximos";
import Linhas from "./Linhas";


const Menu = ({props}) => {
    const [desc, coord, MudarComponente, id] = props;

    const handleclick = (e)=>{
    MudarComponente(<Proximos key={2} props={[desc, MudarComponente, id, coord]} />)
    e.stopPropagation()
    }
    return (<><div className="min-w-72 min-h-80 flexflex-col justify-center align-center">
        <div className='text-center'>{desc}</div>
        <div className='bg-red-400 flex flex-row text-center rounded-md shadow-inner w-full'>
            
            <div className="p-2 m-2 bg-gray-100 rounded-md font-semibold shadow-md cursor-pointer"
                onClick={handleclick} > Ver próximos ônibus</div>
            
            <div className="p-2 m-2 bg-gray-100 rounded-md font-semibold shadow-md cursor-pointer" 
                onClick={(e)=>{ MudarComponente(<Linhas key={3} props={[id, MudarComponente]}/>) ;e.stopPropagation()}} > Ver linhas que param aqui</div>
        </div>

        <div className="text-center"> Latitude: {coord[0]}<br />Longitude: {coord[1]}</div>
        </div>
        </>)
}

export default Menu;
