import type { Corridor } from '../data/corridors'

const STATUS_CONFIG = {
  green: {
    label: 'Corredor verde',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.28)',
    bar: 'linear-gradient(90deg,#16a34a,#22c55e)',
  },
  optimizing: {
    label: 'Optimizando',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.28)',
    bar: 'linear-gradient(90deg,#ea580c,#f97316)',
  },
  critical: {
    label: 'Crítico',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.28)',
    bar: 'linear-gradient(90deg,#dc2626,#ef4444)',
  },
}

export function CorridorCard({ corridor }: { corridor: Corridor }) {
  const s = STATUS_CONFIG[corridor.status]

  return (
    <div className="island-shell flex flex-col gap-4 rounded-2xl p-5">
      {/* Ruta + badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-base">
            <span>{corridor.fromFlag}</span>
            <span className="text-xs text-[var(--sea-ink-soft)]">→</span>
            <span>{corridor.toFlag}</span>
          </div>
          <p className="text-sm font-semibold text-[var(--sea-ink)]">
            {corridor.from} → {corridor.to}
          </p>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 9px',
            borderRadius: '20px',
            background: s.bg,
            border: `1px solid ${s.border}`,
            fontSize: '10px',
            fontWeight: 700,
            color: s.color,
            flexShrink: 0,
          }}
        >
          <span
            style={{ width: '5px', height: '5px', backgroundColor: s.color, borderRadius: '50%', display: 'inline-block' }}
          />
          {s.label}
        </span>
      </div>

      {/* Stats mini-grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { val: corridor.distance,  lbl: 'Distancia' },
          { val: corridor.co2Saved,  lbl: 'CO₂ evitado' },
          { val: corridor.reduction, lbl: 'Reducción' },
        ].map(({ val, lbl }) => (
          <div key={lbl} className="rounded-xl bg-[var(--sand)] p-2">
            <p className="text-sm font-bold text-[var(--sea-ink)]">{val}</p>
            <p className="text-[10px] text-[var(--sea-ink-soft)]">{lbl}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="mb-1 flex justify-between text-[10px] text-[var(--sea-ink-soft)]">
          <span>Optimización</span>
          <span>{corridor.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${corridor.progress}%`, background: s.bar }}
          />
        </div>
      </div>

      {/* Tipo de carga */}
      <p className="text-[11px] text-[var(--sea-ink-soft)]">
        <span className="font-semibold text-[var(--sea-ink)]">Carga: </span>
        {corridor.cargo}
      </p>
    </div>
  )
}
