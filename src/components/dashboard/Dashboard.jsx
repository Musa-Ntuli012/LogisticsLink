import { useMemo, useState, useEffect } from 'react'
import { Activity, AlertTriangle, Package, ShipWheel, TrendingUp } from 'lucide-react'
import StatCard from './StatCard'
import CongestionMeter from './CongestionMeter'
import AlertFeed from './AlertFeed'
import { PortTrendChart, SupplierPerformanceChart, RouteReliabilityChart } from './AnalyticsChart'
import { samplePorts, sampleContainers, getOverallCongestionScore } from '../../utils/portSimulator'
import { sampleRoutes } from '../../utils/routeCalculator'
import { loadContainers, loadSuppliers } from '../../utils/localStorage'
import { sampleSuppliers } from '../../utils/supplierData'

function Dashboard() {
  const [containers, setContainers] = useState(sampleContainers)
  const [suppliers] = useState(() => loadSuppliers(sampleSuppliers))
  
  useEffect(() => {
    const savedContainers = loadContainers(sampleContainers)
    setContainers(savedContainers)
  }, [])

  const congestionScore = useMemo(() => getOverallCongestionScore(samplePorts), [])

  const activeShipments = containers.filter(
    (c) => c.status !== 'delivered' && c.status !== 'cancelled',
  ).length

  const criticalAlerts = containers.reduce(
    (count, c) => count + (c.alerts?.filter((a) => a.type === 'delay').length ?? 0),
    0,
  )

  const onTimeRate = useMemo(() => {
    const total = sampleRoutes.length
    if (!total) return 0
    const good = sampleRoutes.filter((r) => r.reliability >= 80).length
    return Math.round((good / total) * 100)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            SA Supply Chain Command Center
          </h1>
          <p className="text-xs md:text-sm text-muted mt-1">
            Live overview of port congestion, shipments and route reliability across South Africa.
          </p>
        </div>
        <div className="badge border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
          <Activity className="h-3 w-3" />
          Live Simulation
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="h-4 w-4 text-primary" />}
          label="Active Shipments"
          value={activeShipments}
          helper="Containers currently in motion"
        />
        <StatCard
          icon={<ShipWheel className="h-4 w-4 text-warning" />}
          label="Port Congestion"
          value={`${congestionScore}`}
          helper="National congestion score"
          valueSuffix="/100"
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4 text-danger" />}
          label="Critical Alerts"
          value={criticalAlerts}
          helper="Shipments at risk"
        />
        <StatCard
          icon={<Activity className="h-4 w-4 text-success" />}
          label="Route Reliability"
          value={onTimeRate}
          valueSuffix="%"
          helper="On-time arrival likelihood"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-4">
        <div className="glass-panel p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                Live Port Congestion
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Durban, Cape Town, Port Elizabeth, Richards Bay
              </p>
            </div>
          </div>
          <CongestionMeter ports={samplePorts} />
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-4 md:p-5">
            <h2 className="text-sm font-semibold tracking-tight mb-3">Critical Alerts</h2>
            <AlertFeed containers={containers} />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">Port Congestion Trends (7 Days)</h2>
          </div>
          <PortTrendChart ports={samplePorts} />
        </div>

        <div className="glass-panel p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">Top Supplier Performance</h2>
          </div>
          <SupplierPerformanceChart suppliers={suppliers} />
        </div>
      </div>

      <div className="glass-panel p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Route Reliability Comparison</h2>
        </div>
        <RouteReliabilityChart routes={sampleRoutes} />
      </div>
    </div>
  )
}

export default Dashboard


