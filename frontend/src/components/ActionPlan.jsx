// import { AlertTriangle, Shield, ShieldAlert } from 'lucide-react'

// export function PestRiskCard({ pestRisk }) {
//   const getRiskConfig = (level) => {
//     switch (level) {
//       case 'HIGH':
//         return {
//           bgColor: 'bg-red-500',
//           borderColor: 'border-red-400',
//           textColor: 'text-white',
//           icon: ShieldAlert,
//           gradient: 'from-red-500 to-red-600',
//         }
//       case 'MEDIUM':
//         return {
//           bgColor: 'bg-amber-500',
//           borderColor: 'border-amber-400',
//           textColor: 'text-white',
//           icon: AlertTriangle,
//           gradient: 'from-amber-500 to-amber-600',
//         }
//       default:
//         return {
//           bgColor: 'bg-emerald-500',
//           borderColor: 'border-emerald-400',
//           textColor: 'text-white',
//           icon: Shield,
//           gradient: 'from-emerald-500 to-emerald-600',
//         }
//     }
//   }

//   const config = getRiskConfig(pestRisk?.level)
//   const Icon = config.icon

//   return (
//     <div className={`rounded-xl bg-gradient-to-br ${config.gradient} p-6 shadow-xl`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-medium text-white/90">Pest Risk Level</h3>
//           <div className="mt-2 flex items-center gap-3">
//             <span className="text-5xl font-bold text-white">{pestRisk?.level || 'N/A'}</span>
//             <span className="text-2xl font-semibold text-white/80">{pestRisk?.percentage || 0}%</span>
//           </div>
//         </div>
//         <div className="rounded-full bg-white/20 p-4">
//           <Icon className="h-10 w-10 text-white" />
//         </div>
//       </div>

//       <div className="mt-6">
//         <h4 className="text-sm font-semibold text-white/80">Contributing Factors:</h4>
//         <input type="file" className="hidden" />
//         <ul className="mt-2 space-y-1">
//           {pestRisk?.reasons?.map((reason, index) => (
//             <li key={index} className="flex items-center gap-2 text-sm text-white/90">
//               <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
//               {reason}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
// }


import { useState } from "react"

export function ActionPlan() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = () => {
    setLoading(true)

    // simulate AI delay
    setTimeout(() => {
      setResult({
        risk: "Medium",
        suggestions: [
          "Increase field monitoring frequency",
          "Apply organic pesticides (Neem oil recommended)",
          "Maintain proper irrigation balance",
          "Remove infected leaves immediately",
        ],
        recommendations: [
          "Use resistant crop varieties",
          "Ensure proper spacing between plants",
          "Install pest traps (yellow sticky traps)",
        ],
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Form Action Plan
      </h3>

      {/* Button */}
      <button
        onClick={handleAnalyze}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-5 space-y-4">

          {/* Risk */}
          <div className="text-sm font-medium text-slate-700">
            Pest Risk Level: <span className="font-bold">{result.risk}</span>
          </div>

          {/* Suggestions */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700">
              Suggested Measures:
            </h4>
            <ul className="mt-2 space-y-1">
              {result.suggestions.map((item, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700">
              Recommendations:
            </h4>
            <ul className="mt-2 space-y-1">
              {result.recommendations.map((item, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  )
}