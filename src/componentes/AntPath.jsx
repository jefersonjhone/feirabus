import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import 'leaflet-ant-path/dist/leaflet-ant-path'
import L from 'leaflet'
const AntPath = ({ positions, options }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const antPath = L.polyline.antPath(positions, options).addTo(map)

    return () => {
      map.removeLayer(antPath)
    }
  }, [map, positions, options])

  return null
}

export default AntPath
