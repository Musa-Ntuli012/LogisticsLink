import { useState, useEffect } from 'react'
import { Route as RouteIcon, Truck, Train, DollarSign, Clock, TrendingUp, AlertCircle, Save, Trash2, Download } from 'lucide-react'
import { sampleRoutes, calculateRouteComparison, getReliabilityColor, getCongestionColor } from '../../utils/routeCalculator'
import { loadRoutes, saveRoutes } from '../../utils/localStorage'
import { exportRoutes } from '../../utils/csvExport'
import toast from 'react-hot-toast'

const MAJOR_CITIES = [
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Port Elizabeth',
  'Pretoria',
  'Bloemfontein',
  'East London',
  'Richards Bay',
]

function RoutesView() {
  const [savedRoutes, setSavedRoutes] = useState(sampleRoutes)
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [cargoWeight, setCargoWeight] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [calculatedRoute, setCalculatedRoute] = useState(null)
  const [showCalculator, setShowCalculator] = useState(false)

  useEffect(() => {
    const saved = loadRoutes(sampleRoutes)
    setSavedRoutes(saved)
  }, [])

  const handleCalculate = () => {
    if (!origin || !destination) {
      toast.error('Please select origin and destination')
      return
    }
    if (origin === destination) {
      toast.error('Origin and destination must be different')
      return
    }

    const weight = cargoWeight ? parseFloat(cargoWeight) : 1000
    const route = calculateRouteComparison(origin, destination, weight, urgency)
    setCalculatedRoute(route)
    toast.success('Route calculated successfully')
  }

  const handleSaveRoute = () => {
    if (!calculatedRoute) return
    const newRoute = {
      ...calculatedRoute,
      routeId: `ROUTE-${Date.now()}`,
    }
    const updated = [...savedRoutes, newRoute]
    setSavedRoutes(updated)
    saveRoutes(updated)
    toast.success('Route saved successfully')
    setCalculatedRoute(null)
  }

  const handleDeleteRoute = (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      const updated = savedRoutes.filter((r) => r.routeId !== routeId)
      setSavedRoutes(updated)
      saveRoutes(updated)
      toast.success('Route deleted')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Freight Route Optimizer</h1>
          <p className="text-xs md:text-sm text-muted mt-1">
            Compare road vs rail options with real-time cost and reliability data
          </p>
        </div>
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="btn-primary"
        >
          {showCalculator ? 'Hide' : 'Plan New Route'}
        </button>
      </div>

      {/* Route Calculator */}
      {showCalculator && (
        <div className="glass-panel p-5">
          <h2 className="text-lg font-semibold mb-4">Plan Your Route</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Origin</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="input-field"
              >
                <option value="">Select origin...</option>
                {MAJOR_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input-field"
              >
                <option value="">Select destination...</option>
                {MAJOR_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-2">
                Cargo Weight (kg)
              </label>
              <input
                type="number"
                value={cargoWeight}
                onChange={(e) => setCargoWeight(e.target.value)}
                placeholder="1000"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-2">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="input-field"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="express">Express</option>
              </select>
            </div>
          </div>
          <button onClick={handleCalculate} className="btn-primary w-full md:w-auto">
            Calculate Route Options
          </button>
        </div>
      )}

      {/* Calculated Route Results */}
      {calculatedRoute && (
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {calculatedRoute.origin} → {calculatedRoute.destination}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleSaveRoute}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Route
              </button>
              <button
                onClick={() => setCalculatedRoute(null)}
                className="text-muted hover:text-slate-200"
              >
                ×
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculatedRoute.modes.map((mode, idx) => (
              <RouteModeCard key={idx} mode={mode} />
            ))}
          </div>
        </div>
      )}

      {/* Saved Routes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Saved Routes</h2>
          {savedRoutes.length > 0 && (
            <button
              onClick={() => {
                try {
                  exportRoutes(savedRoutes)
                  toast.success('Routes exported to CSV')
                } catch (error) {
                  toast.error('Failed to export routes')
                }
              }}
              className="px-4 py-2 border border-slate-800 rounded-xl text-sm hover:bg-slate-800/50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
        {savedRoutes.length === 0 ? (
          <div className="glass-panel p-8 text-center">
            <RouteIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-muted">No saved routes yet. Calculate and save a route to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedRoutes.map((route) => (
              <div key={route.routeId} className="glass-panel p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold">
                      {route.origin} → {route.destination}
                    </h3>
                    <p className="text-xs text-muted mt-1">Route ID: {route.routeId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RouteIcon className="h-5 w-5 text-primary" />
                    <button
                      onClick={() => handleDeleteRoute(route.routeId)}
                      className="p-2 rounded-lg border border-danger/30 text-danger hover:bg-danger/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {route.modes.map((mode, idx) => (
                    <RouteModeCard key={idx} mode={mode} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RouteModeCard({ mode }) {
  const isRail = mode.type === 'rail'
  const Icon = isRail ? Train : Truck

  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${isRail ? 'bg-primary/20' : 'bg-warning/20'}`}>
          <Icon className={`h-4 w-4 ${isRail ? 'text-primary' : 'text-warning'}`} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold capitalize">{mode.type}</div>
          {mode.status && (
            <div className="text-xs text-warning flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3 w-3" />
              {mode.status.replace('_', ' ')}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Time
          </span>
          <span className="font-medium">{mode.estimatedTime.toFixed(1)} hours</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Distance</span>
          <span className="font-medium">{mode.distance} km</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Total Cost
          </span>
          <span className="font-medium">R {mode.cost.toLocaleString()}</span>
        </div>
        {mode.reliability !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-muted flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Reliability
            </span>
            <span className={`font-medium ${getReliabilityColor(mode.reliability)}`}>
              {mode.reliability}%
            </span>
          </div>
        )}
        {mode.congestionLevel && (
          <div className="flex items-center justify-between">
            <span className="text-muted">Congestion</span>
            <span className={`font-medium capitalize ${getCongestionColor(mode.congestionLevel)}`}>
              {mode.congestionLevel}
            </span>
          </div>
        )}
        {mode.fuelCost && (
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted">Fuel Cost</span>
              <span className="font-medium">R {mode.fuelCost.toLocaleString()}</span>
            </div>
            {mode.tollFees && (
              <div className="flex items-center justify-between">
                <span className="text-muted">Toll Fees</span>
                <span className="font-medium">R {mode.tollFees.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted">Carbon Footprint</span>
              <span className="font-medium">{mode.carbonFootprint} kg CO₂</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoutesView

