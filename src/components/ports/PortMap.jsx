import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Port coordinates for South Africa
const PORT_COORDINATES = {
  durban: [-29.8587, 31.0218],
  'cape-town': [-33.9045, 18.4241],
  pe: [-33.9614, 25.6144],
  'richards-bay': [-28.8006, 32.0917],
}

function PortMap({ ports, selectedPort, onPortSelect }) {
  const mapRef = useRef(null)

  const getCongestionColor = (score) => {
    if (score >= 75) return '#ef4444' // danger
    if (score >= 50) return '#f59e0b' // warning
    return '#10b981' // success
  }

  const createCustomIcon = (port) => {
    const color = getCongestionColor(port.congestionScore)
    return L.divIcon({
      className: 'custom-port-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-slate-800">
      <MapContainer
        center={[-29.0, 25.0]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ports.map((port) => {
          const coords = PORT_COORDINATES[port.portId]
          if (!coords) return null

          return (
            <Marker
              key={port.portId}
              position={coords}
              icon={createCustomIcon(port)}
              eventHandlers={{
                click: () => onPortSelect && onPortSelect(port),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold mb-1">{port.portName}</div>
                  <div className="text-xs space-y-1">
                    <div>Congestion: {port.congestionScore}/100</div>
                    <div>Vessels: {port.vesselsWaiting}</div>
                    <div>Wait: {port.averageWaitDays.toFixed(1)} days</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default PortMap

