import { useState } from 'react'
import { Calculator, DollarSign, AlertCircle } from 'lucide-react'
import { samplePorts } from '../../utils/portSimulator'

function CostCalculator() {
  const [selectedPort, setSelectedPort] = useState('durban')
  const [containerCount, setContainerCount] = useState(1)
  const [delayDays, setDelayDays] = useState(0)
  const [storageDays, setStorageDays] = useState(0)

  const port = samplePorts.find((p) => p.portId === selectedPort) || samplePorts[0]

  // Cost calculations (ZAR)
  const demurragePerDay = 850 // Base demurrage per container per day
  const storagePerDay = 450 // Storage fee per container per day
  const delayMultiplier = port.congestionScore / 50 // Higher congestion = higher fees

  const demurrageCost = containerCount * demurragePerDay * delayDays * delayMultiplier
  const storageCost = containerCount * storagePerDay * storageDays
  const totalCost = demurrageCost + storageCost

  // Alternative ports comparison
  const alternativePorts = samplePorts
    .filter((p) => p.portId !== selectedPort)
    .map((p) => ({
      ...p,
      estimatedDelay: p.averageWaitDays,
      estimatedCost: containerCount * demurragePerDay * p.averageWaitDays * (p.congestionScore / 50),
    }))
    .sort((a, b) => a.estimatedCost - b.estimatedCost)

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Port Cost Calculator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Port</label>
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="input-field"
          >
            {samplePorts.map((p) => (
              <option key={p.portId} value={p.portId}>
                {p.portName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Number of Containers</label>
          <input
            type="number"
            min="1"
            value={containerCount}
            onChange={(e) => setContainerCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-2">
            Delay Days (due to congestion)
          </label>
          <input
            type="number"
            min="0"
            value={delayDays}
            onChange={(e) => setDelayDays(Math.max(0, parseInt(e.target.value) || 0))}
            className="input-field"
          />
          <p className="text-xs text-muted mt-1">
            Current avg wait: {port.averageWaitDays.toFixed(1)} days
          </p>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Storage Days</label>
          <input
            type="number"
            min="0"
            value={storageDays}
            onChange={(e) => setStorageDays(Math.max(0, parseInt(e.target.value) || 0))}
            className="input-field"
          />
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Demurrage Cost</span>
            <span className="text-lg font-semibold">R {demurrageCost.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted">
            {containerCount} containers × R {demurragePerDay.toLocaleString()}/day × {delayDays} days ×{' '}
            {delayMultiplier.toFixed(2)}x multiplier
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">Storage Cost</span>
            <span className="text-lg font-semibold">R {storageCost.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted">
            {containerCount} containers × R {storagePerDay.toLocaleString()}/day × {storageDays} days
          </div>
        </div>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Estimated Cost</span>
            <span className="text-2xl font-bold text-primary">R {totalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Alternative Ports Comparison */}
      {alternativePorts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            Consider Alternative Ports
          </h3>
          <div className="space-y-2">
            {alternativePorts.slice(0, 3).map((altPort) => (
              <div
                key={altPort.portId}
                className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium">{altPort.portName}</div>
                  <div className="text-xs text-muted">
                    Est. delay: {altPort.estimatedDelay.toFixed(1)} days • Congestion:{' '}
                    {altPort.congestionScore}/100
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-success">
                    R {altPort.estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted">
                    Save: R {(totalCost - altPort.estimatedCost).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CostCalculator

