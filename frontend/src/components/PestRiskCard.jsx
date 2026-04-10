import { AlertTriangle, Shield, ShieldAlert } from 'lucide-react'

export function PestRiskCard({ pestRisk }) {
  const getRiskConfig = (level) => {
    switch (level) {
      case 'HIGH':
        return {
          bgColor: 'bg-red-500',
          borderColor: 'border-red-400',
          textColor: 'text-white',
          icon: ShieldAlert,
          gradient: 'from-red-500 to-red-600',
        }
      case 'MEDIUM':
        return {
          bgColor: 'bg-amber-500',
          borderColor: 'border-amber-400',
          textColor: 'text-white',
          icon: AlertTriangle,
          gradient: 'from-amber-500 to-amber-600',
        }
      default:
        return {
          bgColor: 'bg-emerald-500',
          borderColor: 'border-emerald-400',
          textColor: 'text-white',
          icon: Shield,
          gradient: 'from-emerald-500 to-emerald-600',
        }
    }
  }

  const config = getRiskConfig(pestRisk?.level)
  const Icon = config.icon

  return (
    <div className={`rounded-xl bg-gradient-to-br ${config.gradient} p-6 shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white/90">Pest Risk Level</h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-5xl font-bold text-white">{pestRisk?.level || 'N/A'}</span>
            <span className="text-2xl font-semibold text-white/80">{pestRisk?.percentage || 0}%</span>
          </div>
        </div>
        <div className="rounded-full bg-white/20 p-4">
          <Icon className="h-10 w-10 text-white" />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-white/80">Contributing Factors:</h4>
        <ul className="mt-2 space-y-1">
          {pestRisk?.reasons?.map((reason, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
