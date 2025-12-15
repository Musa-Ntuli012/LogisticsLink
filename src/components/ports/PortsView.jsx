import { useState, useEffect } from 'react'
import { Ship, AlertCircle, TrendingUp, TrendingDown, Minus, Cloud, Plus, Edit2, Trash2, X, Package, Map, Calculator, Download } from 'lucide-react'
import { samplePorts } from '../../utils/portSimulator'
import { exportContainers } from '../../utils/csvExport'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import PortMap from './PortMap'
import CostCalculator from './CostCalculator'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext.jsx'

function PortsView() {
  const { company, role, licenceExpired } = useAuth()
  const canWrite = !licenceExpired && role !== 'viewer'
  const [selectedPort, setSelectedPort] = useState(null)
  const [containers, setContainers] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContainer, setEditingContainer] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [showCostCalculator, setShowCostCalculator] = useState(false)

  // Load containers from Supabase on mount (with fallback seeding from sample data)
  useEffect(() => {
    if (!company?.id) return

    async function load() {
      const { data, error } = await supabase
        .from('containers')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Error loading containers from Supabase:', error)
        toast.error('Failed to load containers')
        setContainers([])
        return
      }

      setContainers(data ?? [])
    }

    load()
  }, [company])

  const handleSaveContainer = async (containerData) => {
    try {
      if (editingContainer) {
        const { data, error } = await supabase
          .from('containers')
          .update({
            company_id: company?.id ?? editingContainer.company_id,
            container_id: containerData.containerId,
            shipment_name: containerData.shipmentName,
            origin: containerData.origin,
            destination: containerData.destination,
            status: containerData.status,
            current_location: containerData.currentLocation,
            eta: containerData.eta,
            confidence: containerData.confidence,
          })
          .eq('id', editingContainer.id)
          .select()

        if (error) throw error

        const updated = data?.[0]
        setContainers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        toast.success('Container updated successfully')
      } else {
        const toInsert = {
          company_id: company?.id ?? null,
          container_id: containerData.containerId || `CONT-${Date.now()}`,
          shipment_name: containerData.shipmentName,
          origin: containerData.origin,
          destination: containerData.destination,
          status: containerData.status,
          current_location: containerData.currentLocation,
          eta: containerData.eta,
          confidence: containerData.confidence,
        }
        const { data, error } = await supabase
          .from('containers')
          .insert(toInsert)
          .select()

        if (error) throw error

        const created = data?.[0]
        setContainers((prev) => [created, ...prev])
        toast.success('Container added successfully')
      }

      setShowAddForm(false)
      setEditingContainer(null)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving container:', error)
      toast.error('Failed to save container')
    }
  }

  const handleDeleteContainer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this container?')) return

    try {
      const { error } = await supabase.from('containers').delete().eq('id', id)
      if (error) throw error

      setContainers((prev) => prev.filter((c) => c.id !== id))
      toast.success('Container deleted')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting container:', error)
      toast.error('Failed to delete container')
    }
  }

  const handleEditContainer = (container) => {
    setEditingContainer(container)
    setShowAddForm(true)
  }

  const getCongestionColor = (score) => {
    if (score >= 75) return 'text-danger'
    if (score >= 50) return 'text-warning'
    return 'text-success'
  }

  const getCongestionBadge = (score) => {
    if (score >= 75) return 'bg-danger/10 border-danger/30 text-danger'
    if (score >= 50) return 'bg-warning/10 border-warning/30 text-warning'
    return 'bg-success/10 border-success/30 text-success'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return <TrendingUp className="h-3 w-3" />
    if (trend === 'decreasing') return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Port & Yard Intelligence</h1>
          <p className="text-xs md:text-sm text-muted mt-1">
            Real-time congestion monitoring for South Africa's major ports and yards feeding your road and rail network
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-primary flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          <button
            onClick={() => setShowCostCalculator(!showCostCalculator)}
            className="btn-primary flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            Cost Calculator
          </button>
        </div>
      </div>

      {/* Interactive Port Map */}
      {showMap && (
        <div className="glass-panel p-5">
          <h2 className="text-lg font-semibold mb-4">Live Port Map</h2>
          <PortMap
            ports={samplePorts}
            selectedPort={selectedPort}
            onPortSelect={setSelectedPort}
          />
        </div>
      )}

      {/* Cost Calculator */}
      {showCostCalculator && <CostCalculator />}

      {/* Port Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {samplePorts.map((port) => (
          <div
            key={port.portId}
            className="glass-panel p-4 cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => setSelectedPort(port)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">{port.portName.split(' ')[0]}</h3>
              </div>
              <div className={`badge ${getCongestionBadge(port.congestionScore)}`}>
                {port.congestionScore}/100
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Vessels Waiting</span>
                <span className="font-medium">{port.vesselsWaiting}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Avg Wait</span>
                <span className="font-medium">{port.averageWaitDays} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Backlog</span>
                <span className="font-medium">
                  {(port.containersBacklog / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-muted">Trend</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(port.trend)}
                  <span className="capitalize">{port.trend}</span>
                </div>
              </div>
              {port.weatherDelay && (
                <div className="flex items-center gap-1 text-warning">
                  <Cloud className="h-3 w-3" />
                  <span>Weather delays</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Port View */}
      {selectedPort && (
        <div className="glass-panel p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">{selectedPort.portName}</h2>
              <p className="text-xs text-muted mt-1">
                Last updated: {format(new Date(selectedPort.lastUpdated), 'PPp')}
              </p>
            </div>
            <button
              onClick={() => setSelectedPort(null)}
              className="text-muted hover:text-slate-200"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-xs text-muted mb-1">Congestion Score</div>
              <div className={`text-2xl font-bold ${getCongestionColor(selectedPort.congestionScore)}`}>
                {selectedPort.congestionScore}
                <span className="text-sm text-muted">/100</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-xs text-muted mb-1">Vessels in Queue</div>
              <div className="text-2xl font-bold text-slate-200">
                {selectedPort.vesselsWaiting}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="text-xs text-muted mb-1">Average Wait Time</div>
              <div className="text-2xl font-bold text-slate-200">
                {selectedPort.averageWaitDays}
                <span className="text-sm text-muted"> days</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Container Backlog</h3>
              <div className="text-3xl font-bold text-slate-200">
                {selectedPort.containersBacklog.toLocaleString()}
                <span className="text-sm font-normal text-muted ml-2">containers</span>
              </div>
            </div>

            {selectedPort.weatherDelay && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning">
                  Weather conditions are causing delays at this port
                </span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold mb-2">Your Containers at This Port</h3>
              <div className="space-y-2">
                {containers
                  .filter((c) => (c.current_location ?? c.currentLocation) === selectedPort.portName)
                  .map((container) => (
                    <div
                      key={container.containerId}
                      className="p-3 rounded-lg bg-slate-900/50 border border-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{container.container_id ?? container.containerId}</div>
                          <div className="text-xs text-muted">{container.shipment_name ?? container.shipmentName}</div>
                        </div>
                        <div className="text-xs text-muted">ETA: {container.eta}</div>
                      </div>
                    </div>
                  ))}
                {containers.filter((c) => (c.current_location ?? c.currentLocation) === selectedPort.portName)
                  .length === 0 && (
                  <div className="text-sm text-muted text-center py-4">
                    No containers currently at this port
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Container Tracking Section */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold">Track Your Containers</h2>
          <div className="flex gap-2">
            {containers.length > 0 && (
              <button
                onClick={() => {
                  try {
                    // Normalise data for CSV export so it works with both Supabase (snake_case)
                    // and legacy local data (camelCase).
                    const exportData = containers.map((c) => ({
                      containerId: c.container_id ?? c.containerId,
                      shipmentName: c.shipment_name ?? c.shipmentName,
                      origin: c.origin,
                      destination: c.destination,
                      status: c.status,
                      currentLocation: c.current_location ?? c.currentLocation,
                      eta: c.eta,
                      confidence: c.confidence,
                    }))
                    exportContainers(exportData)
                    toast.success('Containers exported to CSV')
                  } catch (error) {
                    toast.error('Failed to export containers')
                  }
                }}
                className="px-4 py-2 border border-slate-800 rounded-xl text-sm hover:bg-slate-800/50 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            )}
            <button
              onClick={() => {
                if (!canWrite) return
                setEditingContainer(null)
                setShowAddForm(true)
              }}
              disabled={!canWrite}
              className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Add Container
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {containers.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No containers tracked yet. Add your first container to get started.</p>
            </div>
          ) : (
            containers.map((container) => (
            <div
              key={container.id ?? container.containerId}
              className="p-4 rounded-lg bg-slate-900/50 border border-slate-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold">{container.container_id ?? container.containerId}</div>
                  <div className="text-xs text-muted mt-1">{container.shipment_name ?? container.shipmentName}</div>
                </div>
                <div className={`badge ${
                  container.status === 'in_port' ? 'bg-warning/10 border-warning/30 text-warning' :
                  container.status === 'transit' ? 'bg-primary/10 border-primary/30 text-primary' :
                  'bg-success/10 border-success/30 text-success'
                }`}>
                  {container.status.replace('_', ' ')}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-3">
                <div>
                  <span className="text-muted">Origin:</span>
                  <div className="font-medium">{container.origin}</div>
                </div>
                <div>
                  <span className="text-muted">Destination:</span>
                  <div className="font-medium">{container.destination}</div>
                </div>
                <div>
                  <span className="text-muted">Current:</span>
                  <div className="font-medium">{container.current_location ?? container.currentLocation}</div>
                </div>
                <div>
                  <span className="text-muted">ETA:</span>
                  <div className="font-medium">{container.eta}</div>
                </div>
              </div>
              {container.alerts && container.alerts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  {(container.alerts || []).map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-warning">
                      <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>{alert.message}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => canWrite && handleEditContainer(container)}
                  disabled={!canWrite}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => canWrite && handleDeleteContainer(container.id ?? container.containerId)}
                  disabled={!canWrite}
                  className="text-xs px-3 py-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger/10 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Container Form */}
      {showAddForm && (
        <ContainerForm
          container={editingContainer}
          onSave={handleSaveContainer}
          onCancel={() => {
            setShowAddForm(false)
            setEditingContainer(null)
          }}
        />
      )}
    </div>
  )
}

function ContainerForm({ container, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    containerId: container?.containerId || '',
    shipmentName: container?.shipmentName || '',
    origin: container?.origin || '',
    destination: container?.destination || '',
    status: container?.status || 'transit',
    currentLocation: container?.currentLocation || '',
    eta: container?.eta || '',
    confidence: container?.confidence || 'medium',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.containerId || !formData.shipmentName) {
      toast.error('Please fill in container ID and shipment name')
      return
    }
    onSave(formData)
  }

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {container ? 'Edit Container' : 'Add New Container'}
        </h2>
        <button onClick={onCancel} className="text-muted hover:text-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Container ID</label>
            <input
              type="text"
              required
              value={formData.containerId}
              onChange={(e) => setFormData({ ...formData, containerId: e.target.value.toUpperCase() })}
              className="input-field"
              placeholder="TCLU1234567"
              disabled={!!container}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Shipment Name</label>
            <input
              type="text"
              required
              value={formData.shipmentName}
              onChange={(e) => setFormData({ ...formData, shipmentName: e.target.value })}
              className="input-field"
              placeholder="November Electronics Order"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Origin</label>
            <input
              type="text"
              required
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="input-field"
              placeholder="Shanghai"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Destination</label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="input-field"
            >
              <option value="">Select destination...</option>
              <option value="Durban">Durban</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Port Elizabeth">Port Elizabeth</option>
              <option value="Richards Bay">Richards Bay</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
            >
              <option value="departed">Departed</option>
              <option value="transit">In Transit</option>
              <option value="in_port">In Port</option>
              <option value="customs">In Customs</option>
              <option value="ready">Ready for Collection</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Current Location</label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="input-field"
              placeholder="Port of Durban"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">ETA</label>
            <input
              type="date"
              value={formData.eta}
              onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Confidence</label>
            <select
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              className="input-field"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            {container ? 'Update Container' : 'Add Container'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-800 rounded-xl text-sm hover:bg-slate-800/50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default PortsView

