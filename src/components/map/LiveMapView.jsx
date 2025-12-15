import { Map } from 'lucide-react'
import PortMap from '../ports/PortMap'
import { samplePorts } from '../../utils/portSimulator'

function LiveMapView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Live Network Map
          </h1>
          <p className="text-xs md:text-sm text-muted mt-1">
            Visual view of South Africa&apos;s key ports feeding your truck fleet. Data is simulated
            for development.
          </p>
        </div>
        <div className="badge border border-primary/30 bg-primary/10 text-primary">
          <Map className="h-3 w-3" />
          Live Map Enabled
        </div>
      </div>

      <div className="glass-panel p-5">
        <h2 className="text-sm font-semibold tracking-tight mb-3">
          Ports & Congestion Overview
        </h2>
        <PortMap
          ports={samplePorts}
          selectedPort={null}
          // eslint-disable-next-line no-console
          onPortSelect={(port) => console.log('Selected port on live map:', port.portName)}
        />
        <p className="text-[11px] text-muted mt-3">
          This map uses sample congestion scores and locations. In production this will be powered
          by live data feeds from your operations and partners.
        </p>
      </div>
    </div>
  )
}

export default LiveMapView


