import { AlertTriangle } from 'lucide-react'

function AlertFeed({ containers }) {
  const alerts = containers
    .flatMap((c) => (c.alerts || []).map((a) => ({ ...a, container: c })))
    .slice(0, 5)

  if (!alerts.length) {
    return <div className="text-xs text-muted">No critical alerts right now.</div>
  }

  return (
    <div className="space-y-2 text-xs">
      {alerts.map((alert, idx) => (
        <div
          key={`${alert.container.containerId}-${idx}`}
          className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/5 px-3 py-2.5"
        >
          <AlertTriangle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium text-sm">{alert.message}</div>
              <span className="badge bg-slate-900 text-muted border-slate-700">
                {alert.container.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-[11px] text-muted">
              {alert.container.shipmentName} • {alert.container.currentLocation} • ETA{' '}
              {alert.container.eta}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AlertFeed


