/**
 * MetricCard
 * Props:
 *   title, value, unit, status, statusColor
 *   icon (Lucide component), bgColor, textColor
 *   source — 'sensor' | 'weather' | 'ndvi' (optional badge)
 */
export function MetricCard({
  title,
  value,
  unit,
  status,
  statusColor,
  icon: Icon,
  bgColor = 'bg-slate-500',
  textColor = 'text-white',
  source,
}) {
  const displayValue = value != null ? (typeof value === 'number' ? value.toFixed(2) : value) : '—'

  const sourceBadge = {
    sensor: { label: 'Sensor', color: 'bg-violet-100 text-violet-700' },
    weather: { label: 'Weather API', color: 'bg-sky-100 text-sky-700' },
    ndvi: { label: 'NDVI API', color: 'bg-emerald-100 text-emerald-700' },
  }[source]

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-white/10 flex flex-col">
      {/* Colored top */}
      <div className={`${bgColor} ${textColor} p-4 flex items-center justify-between`}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1 leading-none">
            {displayValue}
            {unit && <span className="text-lg ml-1 opacity-80">{unit}</span>}
          </p>
        </div>
        <div className="rounded-full bg-white/20 p-2.5">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-white px-4 py-2.5 flex items-center justify-between gap-2">
        {status && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
            {status}
          </span>
        )}
        {sourceBadge && (
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ml-auto ${sourceBadge.color}`}>
            {sourceBadge.label}
          </span>
        )}
      </div>
    </div>
  )
}