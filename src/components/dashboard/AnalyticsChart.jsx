import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function PortTrendChart({ ports }) {
  // Simulate 7-day trend data
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
      Durban: ports.find((p) => p.portId === 'durban')?.congestionScore || 0,
      'Cape Town': ports.find((p) => p.portId === 'cape-town')?.congestionScore || 0,
      'Port Elizabeth': ports.find((p) => p.portId === 'pe')?.congestionScore || 0,
      'Richards Bay': ports.find((p) => p.portId === 'richards-bay')?.congestionScore || 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            background: '#020617',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line type="monotone" dataKey="Durban" stroke="#ef4444" strokeWidth={2} />
        <Line type="monotone" dataKey="Cape Town" stroke="#3b82f6" strokeWidth={2} />
        <Line type="monotone" dataKey="Port Elizabeth" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="Richards Bay" stroke="#f59e0b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SupplierPerformanceChart({ suppliers }) {
  const data = suppliers.slice(0, 5).map((s) => ({
    name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
    'On-Time %': s.metrics?.onTimeDeliveryRate || 0,
    'Accuracy %': s.metrics?.orderAccuracy || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={80} />
        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            background: '#020617',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="On-Time %" fill="#10b981" />
        <Bar dataKey="Accuracy %" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RouteReliabilityChart({ routes }) {
  const data = routes.slice(0, 5).map((r) => ({
    route: `${r.origin.substring(0, 3)}-${r.destination.substring(0, 3)}`,
    Road: r.modes.find((m) => m.type === 'road')?.reliability || 0,
    Rail: r.modes.find((m) => m.type === 'rail')?.reliability || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="route" stroke="#64748b" style={{ fontSize: '12px' }} />
        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            background: '#020617',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="Road" fill="#f59e0b" />
        <Bar dataKey="Rail" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

