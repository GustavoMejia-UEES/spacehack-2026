/**
 * HeatMap.tsx
 *
 * Visualización CSS/SVG de mapa de calor global de emisiones.
 * Placeholder listo para reemplazar con Leaflet o Mapbox:
 *   1. npm install leaflet react-leaflet
 *   2. Reemplaza el contenido de este componente
 *   3. Los datos en ../data/hotspots.ts ya tienen lat/lng-ready structure
 */

import type { Hotspot, MapRoute } from '../data/hotspots'

const LEVEL_COLORS: Record<string, { heat: string; dot: string; border: string }> = {
  critical: { heat: 'rgba(239,68,68,0.45)',  dot: '#ef4444', border: 'rgba(239,68,68,0.7)' },
  high:     { heat: 'rgba(249,115,22,0.38)', dot: '#f97316', border: 'rgba(249,115,22,0.6)' },
  medium:   { heat: 'rgba(234,179,8,0.30)',  dot: '#eab308', border: 'rgba(234,179,8,0.5)' },
  green:    { heat: 'rgba(34,197,94,0.32)',  dot: '#22c55e', border: 'rgba(34,197,94,0.6)' },
}

const ROUTE_COLORS: Record<string, string> = {
  traditional: '#ef4444',
  optimizing:  '#f97316',
  green:       '#22c55e',
}

interface HeatMapProps {
  hotspots: Hotspot[]
  routes: MapRoute[]
}

export function HeatMap({ hotspots, routes }: HeatMapProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: '400px', background: '#060d1a' }}
    >
      {/* Grid de fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Línea de escaneo satelital */}
      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)',
          animation: 'sat-scan 5s linear infinite',
          top: 0,
        }}
      />

      {/* Blobs de calor */}
      {hotspots.map((h) => (
        <div
          key={h.id}
          className="pointer-events-none absolute"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${LEVEL_COLORS[h.level].heat}, transparent 68%)`,
          }}
        />
      ))}

      {/* Rutas (SVG) */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <marker id="arrow-green"     markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#22c55e" opacity="0.8" />
          </marker>
          <marker id="arrow-orange"    markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#f97316" opacity="0.8" />
          </marker>
          <marker id="arrow-red"       markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" opacity="0.6" />
          </marker>
        </defs>
        {routes.map((r) => {
          const markerId =
            r.type === 'green' ? 'arrow-green'
            : r.type === 'optimizing' ? 'arrow-orange'
            : 'arrow-red'
          return (
            <line
              key={r.id}
              x1={`${r.fromX}%`}
              y1={`${r.fromY}%`}
              x2={`${r.toX}%`}
              y2={`${r.toY}%`}
              stroke={ROUTE_COLORS[r.type]}
              strokeWidth={r.type === 'traditional' ? 1 : 1.5}
              strokeDasharray={r.type === 'traditional' ? '6 4' : r.type === 'optimizing' ? '10 3' : '0'}
              opacity={r.type === 'traditional' ? 0.45 : 0.75}
              markerEnd={`url(#${markerId})`}
            />
          )
        })}
      </svg>

      {/* Nodos de puertos */}
      {hotspots.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          {/* Anillo pulsante */}
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: `1px solid ${LEVEL_COLORS[h.level].border}`,
              animation: 'node-ring 2.5s ease-out infinite',
            }}
          />
          {/* Dot */}
          <div
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: LEVEL_COLORS[h.level].dot,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${LEVEL_COLORS[h.level].dot}`,
            }}
          />
          {/* Label */}
          <span
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.65)',
              fontSize: '9px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 6px rgba(0,0,0,0.9)',
              pointerEvents: 'none',
            }}
          >
            {h.name}
          </span>
        </div>
      ))}

      {/* Header del mapa */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
        <div>
          <p
            style={{
              color: 'rgba(249,115,22,0.9)',
              fontFamily: 'monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '3px',
            }}
          >
            ● LIVE · Satellite Feed
          </p>
          <p style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
            Global Emissions Heatmap
          </p>
        </div>

        {/* Leyenda de niveles */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {([
            { color: '#ef4444', label: 'Crítico' },
            { color: '#f97316', label: 'Alto' },
            { color: '#eab308', label: 'Medio' },
            { color: '#22c55e', label: 'Green' },
          ] as const).map(({ color, label }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' }}
            >
              <div style={{ width: '6px', height: '6px', backgroundColor: color, borderRadius: '50%' }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda de rutas (footer) */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-end gap-4 p-3"
        style={{ background: 'linear-gradient(transparent, rgba(6,13,26,0.85))' }}
      >
        {([
          { color: '#ef4444', label: 'Ruta tradicional', dash: '6 4' },
          { color: '#f97316', label: 'En optimización',  dash: '10 3' },
          { color: '#22c55e', label: 'Green corridor',   dash: '' },
        ] as const).map(({ color, label, dash }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.55)' }}
          >
            <svg width="22" height="3">
              <line x1="0" y1="1.5" x2="22" y2="1.5" stroke={color} strokeWidth="2" strokeDasharray={dash} />
            </svg>
            {label}
          </div>
        ))}
      </div>

      {/* Badge placeholder */}
      <div
        className="absolute right-4"
        style={{
          top: '64px',
          background: 'rgba(249,115,22,0.1)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '9px',
          fontFamily: 'monospace',
          color: 'rgba(249,115,22,0.75)',
        }}
      >
        ⚡ Placeholder · Listo para Leaflet / Mapbox
      </div>

      <style>{`
        @keyframes sat-scan {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes node-ring {
          0%   { transform: scale(0.8); opacity: 0.9; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
