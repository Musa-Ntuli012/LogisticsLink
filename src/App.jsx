import './App.css'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ShipWheel, Map, Boxes, Route as RouteIcon, Bell, BadgeDollarSign, AlertTriangle } from 'lucide-react'
import Dashboard from './components/dashboard/Dashboard'
import PortsView from './components/ports/PortsView'
import RoutesView from './components/routes/RoutesView'
import SuppliersView from './components/suppliers/SuppliersView'
import PricingView from './components/pricing/PricingView'
import LiveMapView from './components/map/LiveMapView'
import LoginView from './components/auth/LoginView.jsx'
import RegisterView from './components/auth/RegisterView.jsx'
import { useAuth } from './lib/AuthContext.jsx'

function App() {
  const { licenceExpired, company, session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 text-sm">
        Loading LogisticsLink...
      </div>
    )
  }

  if (!session) {
    // Public auth routes (login/register) before a user is signed in
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-900 text-slate-100">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/register" element={<RegisterView />} />
          <Route path="*" element={<LoginView />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-background to-slate-900 text-slate-100">
      <Toaster position="top-right" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl">
          <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800">
            <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShipWheel className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">LogisticsLink</div>
              <div className="text-xs text-muted">SA Logistics Command Center</div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2 text-sm">
            <NavItem to="/dashboard" label="Fleet Overview" icon={<Bell className="h-4 w-4" />} />
            <NavItem to="/ports" label="Port & Yard Insight" icon={<ShipWheel className="h-4 w-4" />} />
            <NavItem to="/routes" label="Road & Rail Routes" icon={<RouteIcon className="h-4 w-4" />} />
            <NavItem to="/suppliers" label="Suppliers" icon={<Boxes className="h-4 w-4" />} />
            <NavItem to="/pricing" label="Licensing & Pricing" icon={<BadgeDollarSign className="h-4 w-4" />} />
            <NavItem to="/map" label="Live Map" icon={<Map className="h-4 w-4" />} />
          </nav>

          <div className="px-4 py-4 border-t border-slate-800 text-xs text-muted space-y-1">
            <div className="flex items-center justify-between">
              <span>Licence Model</span>
              <span className="badge border border-primary/30 bg-primary/10 text-primary">
                1 / 2 / 5 Year
              </span>
            </div>
            {company?.licence_expires_at && (
              <p>
                Expires:{' '}
                <span className={licenceExpired ? 'text-danger' : 'text-success'}>
                  {new Date(company.licence_expires_at).toLocaleDateString('en-ZA')}
                </span>
              </p>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="md:hidden flex flex-col gap-1 px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShipWheel className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">LogisticsLink</span>
              </div>
              {company?.name && (
                <span className="text-[11px] text-muted truncate max-w-[50%] text-right">
                  {company.name}
                </span>
              )}
            </div>
            {licenceExpired && (
              <div className="mt-1 rounded-lg border border-danger/40 bg-danger/10 px-2 py-1 flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3 text-danger" />
                <span className="text-[11px] text-danger">
                  Licence expired – data is read-only. Please renew in Pricing.
                </span>
              </div>
            )}
          </header>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center justify-around px-2 py-2 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-[49px] z-40">
            <NavItem to="/dashboard" label="Fleet" icon={<Bell className="h-4 w-4" />} mobile />
            <NavItem to="/ports" label="Ports/Yards" icon={<ShipWheel className="h-4 w-4" />} mobile />
            <NavItem to="/routes" label="Routes" icon={<RouteIcon className="h-4 w-4" />} mobile />
            <NavItem to="/suppliers" label="Suppliers" icon={<Boxes className="h-4 w-4" />} mobile />
            <NavItem to="/pricing" label="Pricing" icon={<BadgeDollarSign className="h-4 w-4" />} mobile />
            <NavItem to="/map" label="Map" icon={<Map className="h-4 w-4" />} mobile />
          </nav>

          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
            {licenceExpired && (
              <div className="mb-3 rounded-xl border border-danger/40 bg-danger/5 px-3 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-danger" />
                  <span className="text-danger">
                    Your LogisticsLink licence has expired. You can still view existing data, but changes are disabled.
                  </span>
                </div>
                <NavLink
                  to="/pricing"
                  className="px-3 py-1.5 rounded-lg bg-danger/80 text-white text-xs font-medium hover:bg-danger"
                >
                  View Licensing
                </NavLink>
              </div>
            )}
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ports" element={<PortsView />} />
              <Route path="/routes" element={<RoutesView />} />
              <Route path="/suppliers" element={<SuppliersView />} />
              <Route path="/pricing" element={<PricingView />} />
              <Route path="/map" element={<LiveMapView />} />
              <Route
                path="*"
                element={
                  <div className="text-center text-sm text-muted pt-10">
                    Unknown page. Redirecting to dashboard...
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function NavItem({ to, label, icon, disabled = false, mobile = false }) {
  if (disabled) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-muted/60 cursor-not-allowed text-xs ${mobile ? 'flex-col' : ''}`}>
        {icon}
        <span>{label}</span>
      </div>
    )
  }

  if (mobile) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            'flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-xs',
            'hover:bg-slate-800/60',
            isActive ? 'bg-slate-800 text-primary font-medium' : 'text-slate-200',
          ].join(' ')
        }
      >
        {icon}
        <span className="text-[10px]">{label}</span>
      </NavLink>
    )
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 px-3 py-2 rounded-xl transition-colors',
          'hover:bg-slate-800/60 text-xs',
          isActive ? 'bg-slate-800 text-primary font-medium' : 'text-slate-200',
        ].join(' ')
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

export default App
