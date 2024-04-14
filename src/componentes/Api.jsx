
const pos = [];
    if (itinerarios_1534.sucesso){
        for (let i in itinerarios_1534.itinerarios){
            pos.push([itinerarios_1534.itinerarios[i].coordY, itinerarios_1534.itinerarios[i].coordX])
        }
    }
    //console.log(pos)



import AntPath from './AntPath';
import itinerarios_1534 from '../mock_dados';
      <AntPath positions={pos} options={{ delay: 400, dashArray: [10, 20], weight: 5, color: '#0000FF' }} />
