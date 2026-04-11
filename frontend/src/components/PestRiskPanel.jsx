import { AlertTriangle, CheckCircle, Bug, Stethoscope, Pill, Clock, ExternalLink } from 'lucide-react'

/**
 * PestRiskPanel
 * Props: pestData — single pest object from GET /api/pest/
 * {
 *   pestName, cause, cure,
 *   confidence, pestRisk,
 *   pestImageURL, timestamp
 * }
 */
export function PestRiskPanel({ pestData }) {
  if (!pestData) {
    return (
      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 flex items-center gap-3 text-slate-400">
        <Bug className="h-5 w-5" />
        <span className="text-sm font-medium">Pest risk data unavailable</span>
      </div>
    )
  }

  const {
    pestName,
    cause,
    cure,
    confidence,
    pestRisk,
    pestImageURL,
    timestamp,
  } = pestData

  // Format pest name: "Corn___Common_rust" → "Corn — Common Rust"
  const formatPestName = (name) => {
    if (!name) return 'Unknown'
    return name
      .replace(/___/g, ' — ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formattedName = formatPestName(pestName)
  const confidencePct = confidence != null ? Math.round(confidence * 100) : null

  const riskLevel = pestRisk
    ? { label: 'Pest Detected', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, bar: 'bg-red-500' }
    : { label: 'No Active Threat', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle, bar: 'bg-emerald-500' }

  const RiskIcon = riskLevel.icon

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <div className={`rounded-2xl bg-white shadow-sm border ${riskLevel.border} overflow-hidden`}>
      {/* Top banner */}
      <div className={`${riskLevel.bg} px-6 py-4 flex items-center justify-between gap-4 border-b ${riskLevel.border}`}>
        <div className="flex items-center gap-3">
          <RiskIcon className={`h-6 w-6 ${riskLevel.color} flex-shrink-0`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Pest Risk Status</p>
            <p className={`text-xl font-bold ${riskLevel.color}`}>{riskLevel.label}</p>
          </div>
        </div>

        {confidencePct != null && (
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs text-slate-500 font-medium">Model Confidence</p>
            <div className="flex items-center gap-2">
              <div className="w-28 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${riskLevel.bar}`}
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${riskLevel.color}`}>{confidencePct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Image */}
        {pestImageURL && (
          <div className="md:col-span-1 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Visual Reference</p>
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video md:aspect-square flex items-center justify-center">
              <img
                src={pestImageURL}
                alt={formattedName}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            {formattedTime && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{formattedTime}</span>
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className={`${pestImageURL ? 'md:col-span-2' : 'md:col-span-3'} flex flex-col gap-5`}>

          {/* Pest Name */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Identified Pest / Disease</p>
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <p className="text-lg font-bold text-slate-800">{formattedName}</p>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 ml-6 font-mono">{pestName}</p>
          </div>

          {/* Cause */}
          {cause && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Stethoscope className="h-4 w-4 text-amber-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Cause</p>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{cause}</p>
            </div>
          )}

          {/* Cure */}
          {cure && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Pill className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Recommended Treatment</p>
              </div>
              <p className="text-sm text-emerald-900 leading-relaxed">{cure}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}