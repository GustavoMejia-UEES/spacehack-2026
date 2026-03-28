import type { EmissionsRoute } from '../data/corridors'

interface EmissionsCompareProps {
  routes: EmissionsRoute[]
  title?: string
}

export function EmissionsCompare({
  routes,
  title = 'Comparativa de emisiones por ruta',
}: EmissionsCompareProps) {
  const max = Math.max(...routes.map((r) => r.co2), 1)

  return (
    <div className="island-shell rounded-2xl p-6">
      <p className="island-kicker mb-2">Emisiones · CO₂ relativo</p>
      <h3 className="mb-6 text-base font-semibold text-[var(--sea-ink)]">{title}</h3>

      <div className="flex flex-col gap-5">
        {routes.map((r) => (
          <div key={r.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="text-[var(--sea-ink-soft)] text-xs">{r.label}</span>
              <span className="font-semibold text-[var(--sea-ink)] text-xs whitespace-nowrap">{r.display}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(r.co2 / max) * 100}%`,
                  background:
                    r.type === 'traditional'
                      ? 'linear-gradient(90deg,#dc2626,#f97316)'
                      : 'linear-gradient(90deg,#16a34a,#4ade80)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[10px] text-[var(--sea-ink-soft)]">
        * Valores placeholder · Se reemplazarán con datos satelitales reales
      </p>
    </div>
  )
}
