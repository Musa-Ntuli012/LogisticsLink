import { useState, useEffect } from 'react'
import { Plus, Star, Mail, Phone, Package, TrendingUp, AlertCircle, X, Download } from 'lucide-react'
import { getStatusColor, getRatingStars } from '../../utils/supplierData'
import { exportSuppliers, exportOrders } from '../../utils/csvExport'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../lib/AuthContext.jsx'

function SuppliersView() {
  const { company, role, licenceExpired } = useAuth()
  const canWrite = !licenceExpired && role !== 'viewer'
  const [suppliers, setSuppliers] = useState([])
  const [orders, setOrders] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!company?.id) return

    async function load() {
      // Load suppliers
      const { data: supplierRows, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (suppliersError) {
        // eslint-disable-next-line no-console
        console.error('Error loading suppliers from Supabase:', suppliersError)
        toast.error('Failed to load suppliers')
        setSuppliers([])
      } else {
        setSuppliers(
          (supplierRows ?? []).map((s) => ({
            id: s.id,
            supplierId: s.supplier_id,
            name: s.name,
            category: s.category,
            location: s.location,
            contactPerson: s.contact_person,
            email: s.email,
            phone: s.phone,
            rating: s.rating ?? 0,
            metrics: s.metrics || {
              onTimeDeliveryRate: 0,
              orderAccuracy: 0,
              responseTime: 0,
              qualityScore: 0,
            },
            orders: s.orders || [],
            notes: s.notes || '',
          })),
        )
      }

      // Load orders
      const { data: orderRows, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (ordersError) {
        // eslint-disable-next-line no-console
        console.error('Error loading orders from Supabase:', ordersError)
        toast.error('Failed to load orders')
        setOrders([])
      } else {
        setOrders(
          (orderRows ?? []).map((o) => ({
            id: o.id,
            orderId: o.order_id,
            supplierId: o.supplier_id,
            supplierName: o.supplier_name,
            product: o.product,
            quantity: o.quantity,
            orderDate: o.order_date,
            expectedDelivery: o.expected_delivery,
            status: o.status,
            value: o.value,
          })),
        )
      }
    }

    load()
  }, [company])

  const handleSaveSupplier = async (supplierData) => {
    try {
      const toInsert = {
        company_id: company?.id ?? null,
        supplier_id: supplierData.supplierId || `SUP-${Date.now()}`,
        name: supplierData.name,
        category: supplierData.category,
        location: supplierData.location,
        contact_person: supplierData.contactPerson,
        email: supplierData.email,
        phone: supplierData.phone,
        rating: supplierData.rating || 0,
        metrics:
          supplierData.metrics || {
            onTimeDeliveryRate: 0,
            orderAccuracy: 0,
            responseTime: 0,
            qualityScore: 0,
          },
        orders: supplierData.orders || [],
        notes: supplierData.notes || '',
      }

      const { data, error } = await supabase
        .from('suppliers')
        .insert(toInsert)
        .select()

      if (error) throw error

      const created = data?.[0]
      const newSupplier = {
        id: created.id,
        supplierId: created.supplier_id,
        name: created.name,
        category: created.category,
        location: created.location,
        contactPerson: created.contact_person,
        email: created.email,
        phone: created.phone,
        rating: created.rating ?? 0,
        metrics: created.metrics || {
          onTimeDeliveryRate: 0,
          orderAccuracy: 0,
          responseTime: 0,
          qualityScore: 0,
        },
        orders: created.orders || [],
        notes: created.notes || '',
      }

      setSuppliers((prev) => [newSupplier, ...prev])
      toast.success('Supplier added successfully!')
      setShowAddForm(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving supplier:', error)
      toast.error('Failed to add supplier')
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Supplier & Inventory Manager</h1>
          <p className="text-xs md:text-sm text-muted mt-1">
            Track supplier performance, manage orders, and optimize inventory
          </p>
        </div>
        <div className="flex gap-2">
          {suppliers.length > 0 && (
            <button
              onClick={() => {
                try {
                  const exportData = suppliers.map((s) => ({
                    supplierId: s.supplierId,
                    name: s.name,
                    category: s.category,
                    location: s.location,
                    contactPerson: s.contactPerson,
                    email: s.email,
                    phone: s.phone,
                    rating: s.rating,
                    metrics: s.metrics,
                  }))
                  exportSuppliers(exportData)
                  toast.success('Suppliers exported to CSV')
                } catch (error) {
                  toast.error('Failed to export suppliers')
                }
              }}
              className="px-4 py-2 border border-slate-800 rounded-xl text-sm hover:bg-slate-800/50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
          <button
            onClick={() => canWrite && setShowAddForm(true)}
            disabled={!canWrite}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4">
        <input
          type="text"
          placeholder="Search suppliers by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id ?? supplier.supplierId}
            supplier={supplier}
            onClick={() => setSelectedSupplier(supplier)}
          />
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="glass-panel p-8 text-center">
          <p className="text-muted">No suppliers found matching your search.</p>
        </div>
      )}

      {/* Add Supplier Form */}
      {showAddForm && (
        <AddSupplierForm onSave={handleSaveSupplier} onClose={() => setShowAddForm(false)} />
      )}

      {/* Supplier Detail View */}
      {selectedSupplier && (
        <SupplierDetailView
          supplier={selectedSupplier}
          orders={orders}
          onClose={() => setSelectedSupplier(null)}
        />
      )}

      {/* Orders Section */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Orders</h2>
          {orders.length > 0 && (
            <button
              onClick={() => {
                try {
                  exportOrders(orders)
                  toast.success('Orders exported to CSV')
                } catch (error) {
                  toast.error('Failed to export orders')
                }
              }}
              className="px-4 py-2 border border-slate-800 rounded-xl text-sm hover:bg-slate-800/50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          )}
        </div>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No orders tracked yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id ?? order.orderId} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function SupplierCard({ supplier, onClick }) {
  const { fullStars, hasHalfStar, emptyStars } = getRatingStars(supplier.rating)

  return (
    <div
      onClick={onClick}
      className="glass-panel p-5 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-1">{supplier.name}</h3>
          <p className="text-xs text-muted">{supplier.category}</p>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-warning text-warning" />
          ))}
          {hasHalfStar && (
            <Star className="h-3 w-3 fill-warning/50 text-warning" />
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-slate-600" />
          ))}
        </div>
      </div>

      <div className="space-y-2 text-xs mb-4">
        <div className="flex items-center gap-2 text-muted">
          <Package className="h-3 w-3" />
          <span>{supplier.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <TrendingUp className="h-3 w-3" />
          <span>{supplier.metrics.onTimeDeliveryRate}% on-time</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted">Response</span>
            <div className="font-medium">{supplier.metrics.responseTime}h</div>
          </div>
          <div>
            <span className="text-muted">Accuracy</span>
            <div className="font-medium">{supplier.metrics.orderAccuracy}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SupplierDetailView({ supplier, onClose, orders = [] }) {
  const { fullStars, hasHalfStar, emptyStars } = getRatingStars(supplier.rating)
  const supplierOrders = orders.filter((o) => o.supplierId === supplier.supplierId)

  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{supplier.name}</h2>
          <p className="text-xs text-muted mt-1">{supplier.category} • {supplier.location}</p>
        </div>
        <button onClick={onClose} className="text-muted hover:text-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-muted mb-1">Rating</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
              {hasHalfStar && (
                <Star className="h-4 w-4 fill-warning/50 text-warning" />
              )}
              {[...Array(emptyStars)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-slate-600" />
              ))}
            </div>
            <span className="text-sm font-semibold">{supplier.rating}/5.0</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-muted mb-1">On-Time Delivery</div>
          <div className="text-2xl font-bold text-success">
            {supplier.metrics.onTimeDeliveryRate}%
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-muted mb-1">Order Accuracy</div>
          <div className="text-2xl font-bold text-slate-200">
            {supplier.metrics.orderAccuracy}%
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="text-xs text-muted mb-1">Avg Response Time</div>
          <div className="text-2xl font-bold text-slate-200">
            {supplier.metrics.responseTime}h
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Contact Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted" />
              <span>{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted" />
              <span>{supplier.phone}</span>
            </div>
            <div className="text-muted">
              Contact: {supplier.contactPerson}
            </div>
          </div>
        </div>

        {supplier.notes && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Notes</h3>
            <p className="text-sm text-muted">{supplier.notes}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold mb-2">Orders ({supplierOrders.length})</h3>
          <div className="space-y-2">
            {supplierOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} compact />
            ))}
            {supplierOrders.length === 0 && (
              <p className="text-sm text-muted">No orders with this supplier</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order, compact = false }) {
  return (
    <div className={`${compact ? 'p-3' : 'p-4'} rounded-lg bg-slate-900/50 border border-slate-800`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-sm font-semibold">{order.orderId}</div>
          <div className="text-xs text-muted mt-0.5">{order.product}</div>
        </div>
        <div className={`badge ${getStatusColor(order.status)}`}>
          {order.status.replace('_', ' ')}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
        <div>
          <span className="text-muted">Quantity</span>
          <div className="font-medium">{order.quantity}</div>
        </div>
        <div>
          <span className="text-muted">Value</span>
          <div className="font-medium">R {order.value.toLocaleString()}</div>
        </div>
        <div>
          <span className="text-muted">Order Date</span>
          <div className="font-medium">{order.orderDate}</div>
        </div>
        <div>
          <span className="text-muted">Expected</span>
          <div className="font-medium">{order.expectedDelivery}</div>
        </div>
      </div>
    </div>
  )
}

function AddSupplierForm({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    contactPerson: '',
    email: '',
    phone: '',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Add New Supplier</h2>
        <button onClick={onClose} className="text-muted hover:text-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Supplier Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Contact Person</label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-2">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="input-field"
            rows="3"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Add Supplier
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-800 rounded-xl text-sm hover:bg-slate-800/50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SuppliersView

