import { useMap } from 'react-leaflet'
import { useMapEvent } from 'react-leaflet'
import { useEffect } from 'react'
import isEmpty from '../utils/isEmpty'

export const MapClick = ({ handleCurrentPoint }) => {
  const map = useMapEvent('click', (e) => {
    if (!isEmpty([])) {
      var mudarlocal = window.confirm('mudar local selecionado')
      if (!mudarlocal) {
        return
      }
    }
    map.flyTo(e.latlng, 16)
    handleCurrentPoint(e.latlng)
  })
}

export const MapFly = ({ currentPoint }) => {
  const mapinstance = useMap()
  useEffect(() => {
    if (currentPoint !== undefined && Object.keys(currentPoint).length > 0) {
      //mapinstance.flyTo([currentPoint.y, currentPoint.x], 16)
    }
  }, [currentPoint])
}
