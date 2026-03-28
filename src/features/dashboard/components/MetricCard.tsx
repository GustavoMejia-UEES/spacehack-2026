import type { CSSProperties } from 'react'
import type { Metric } from '../data/metrics'

const TREND_ARROW = { up: '↑', down: '↓', neutral: '→' } as const

// CO₂ "down" es bueno → verde. "up" en otros KPIs = verde también.
const TREND_COLOR: Record<string, string> = {
  up: 'color: rgb(74,222,128)',
  down: 'color: rgb(74,222,128)',
  neutral: 'color: var(--sea-ink-soft)',
}

interface MetricCardProps {
  metric: Metric
  style?: CSSProperties
}

export function MetricCard({ metric, style }: MetricCardProps) {
  return (
    <div className="island-shell rise-in flex flex-col gap-3 rounded-2xl p-6" style={style}>
      {/* Valor principal */}
      <div>
        <p className="display-title mb-0.5 text-5xl font-bold leading-none text-[var(--lagoon-deep)]">
          {metric.value}
        </p>
        {metric.unit && (
          <span className="text-xs text-[var(--sea-ink-soft)]">{metric.unit}</span>
        )}
      </div>

      {/* Label */}
      <div>
        <p className="text-sm font-semibold text-[var(--sea-ink)]">{metric.label}</p>
        <p className="text-xs text-[var(--sea-ink-soft)]">{metric.sub}</p>
      </div>

      {/* Tendencia */}
      {metric.trendValue && (
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ [Object.keys(TREND_COLOR)[0]]: TREND_COLOR[metric.trend] }}
        >
          <span style={{ color: metric.trend === 'neutral' ? 'var(--sea-ink-soft)' : 'rgb(74,222,128)' }}>
            {TREND_ARROW[metric.trend]} {metric.trendValue}
          </span>
        </div>
      )}

      {/* Barra de progreso */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full rounded-full bg-[var(--lagoon)] transition-all duration-700"
          style={{ width: `${metric.progress}%` }}
        />
      </div>
    </div>
  )
}
