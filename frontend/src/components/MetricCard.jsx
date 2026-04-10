export function MetricCard({ title, value, unit, status, icon: Icon, bgColor, textColor, statusColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg transition-transform hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} opacity-80`}>{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`text-4xl font-bold ${textColor}`}>
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            {unit && <span className={`text-lg ${textColor} opacity-70`}>{unit}</span>}
          </div>
          {status && (
            <div className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
              {status}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`rounded-full bg-white/20 p-3 ${textColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}
