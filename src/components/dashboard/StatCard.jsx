function StatCard({ icon, label, value, valueSuffix, helper }) {
  return (
    <div className="glass-panel p-4 flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wide text-muted font-semibold">{label}</div>
        <div className="flex items-baseline gap-1">
          <div className="text-xl md:text-2xl font-semibold">
            {value}
            {valueSuffix && <span className="text-xs text-muted ml-1">{valueSuffix}</span>}
          </div>
        </div>
        {helper && <div className="text-[11px] text-muted">{helper}</div>}
      </div>
      <div className="h-9 w-9 rounded-xl bg-slate-900/80 flex items-center justify-center border border-slate-800">
        {icon}
      </div>
    </div>
  )
}

export default StatCard


