import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#22c55e', '#eab308', '#ef4444']

function CongestionMeter({ ports }) {
  const congestion = ports.map((p) => ({
    name: p.portName,
    value: p.congestionScore,
  }))

  return (
    <div className="h-64 md:h-72 flex flex-col md:flex-row gap-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-40 h-40">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={congestion}
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                paddingAngle={2}
              >
                {congestion.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-muted max-w-xs">
          Congestion intensity across major South African ports. Higher score = longer delays.
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {ports.map((port) => (
          <div
            key={port.portId}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2"
          >
            <div>
              <div className="text-xs font-medium">{port.portName}</div>
              <div className="text-[11px] text-muted">
                {port.vesselsWaiting} vessels • {port.averageWaitDays.toFixed(1)} day wait
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={[
                  'badge',
                  port.congestionScore >= 70
                    ? 'bg-danger/10 text-danger border-danger/40'
                    : port.congestionScore >= 40
                      ? 'bg-warning/10 text-warning border-warning/40'
                      : 'bg-success/10 text-success border-success/40',
                ].join(' ')}
              >
                {port.congestionScore}/100
              </span>
              <span className="text-[11px] text-muted">
                {port.trend === 'increasing' && 'Rising'}
                {port.trend === 'stable' && 'Stable'}
                {port.trend === 'decreasing' && 'Easing'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CongestionMeter


