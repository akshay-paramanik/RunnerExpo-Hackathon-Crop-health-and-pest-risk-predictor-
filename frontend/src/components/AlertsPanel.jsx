import { AlertCircle, CheckCircle, Info } from 'lucide-react'

export function AlertsPanel({ alerts }) {
  const getAlertConfig = (type) => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-amber-50',
          borderColor: 'border-l-amber-500',
          iconColor: 'text-amber-500',
          textColor: 'text-amber-800',
        }
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-l-emerald-500',
          iconColor: 'text-emerald-500',
          textColor: 'text-emerald-800',
        }
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          iconColor: 'text-blue-500',
          textColor: 'text-blue-800',
        }
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Active Alerts</h3>
      <div className="space-y-3">
        {alerts?.map((alert, index) => {
          const config = getAlertConfig(alert.type)
          const Icon = config.icon
          return (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor} p-4`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${config.textColor}`}>{alert.message}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityBadge(alert.priority)}`}>
                {alert.priority}
              </span>
            </div>
          )
        })}
        {(!alerts || alerts.length === 0) && (
          <p className="text-center text-sm text-slate-500">No active alerts</p>
        )}
      </div>
    </div>
  )
}
