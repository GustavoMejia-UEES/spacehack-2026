// ✏️ Actualiza co2Saved, reduction y progress con datos reales

export type CorridorStatus = 'green' | 'optimizing' | 'critical'

export interface Corridor {
  id: string
  from: string
  to: string
  fromFlag: string
  toFlag: string
  status: CorridorStatus
  distance: string
  co2Saved: string   // "12.4k ton" | "—" placeholder
  reduction: string  // "−38%" | "—"
  cargo: string
  progress: number   // 0-100 para barra visual
}

export const CORRIDORS: Corridor[] = [
  {
    id: 'c1',
    from: 'Shanghai',
    to: 'Rotterdam',
    fromFlag: '🇨🇳',
    toFlag: '🇳🇱',
    status: 'optimizing',
    distance: '20,300 km',
    co2Saved: '—',
    reduction: '—%',
    cargo: 'Electrónica · Textil',
    progress: 45,
  },
  {
    id: 'c2',
    from: 'Singapur',
    to: 'Rotterdam',
    fromFlag: '🇸🇬',
    toFlag: '🇳🇱',
    status: 'green',
    distance: '16,800 km',
    co2Saved: '—',
    reduction: '—%',
    cargo: 'Químicos · Commodities',
    progress: 80,
  },
  {
    id: 'c3',
    from: 'Los Ángeles',
    to: 'Rotterdam',
    fromFlag: '🇺🇸',
    toFlag: '🇳🇱',
    status: 'critical',
    distance: '14,200 km',
    co2Saved: '—',
    reduction: '—%',
    cargo: 'Automóviles · Consumer',
    progress: 15,
  },
  {
    id: 'c4',
    from: 'Santos',
    to: 'Rotterdam',
    fromFlag: '🇧🇷',
    toFlag: '🇳🇱',
    status: 'green',
    distance: '9,700 km',
    co2Saved: '—',
    reduction: '—%',
    cargo: 'Commodities · Agro',
    progress: 72,
  },
]

// ✏️ Datos para comparativa de emisiones
export interface EmissionsRoute {
  label: string
  co2: number        // valor relativo para proporciones (no tiene que ser absoluto)
  display: string    // texto a mostrar
  type: 'traditional' | 'optimized'
}

export const EMISSIONS_COMPARISON: EmissionsRoute[] = [
  {
    label: 'Shanghai → Rotterdam (ruta tradicional)',
    co2: 100,
    display: '— ton CO₂',
    type: 'traditional',
  },
  {
    label: 'Shanghai → Rotterdam (green corridor)',
    co2: 62,
    display: '— ton CO₂  (−38% est.)',
    type: 'optimized',
  },
  {
    label: 'LA → Rotterdam (ruta tradicional)',
    co2: 85,
    display: '— ton CO₂',
    type: 'traditional',
  },
  {
    label: 'Singapur → Rotterdam (green corridor)',
    co2: 48,
    display: '— ton CO₂  (−43% est.)',
    type: 'optimized',
  },
]
