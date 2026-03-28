// ✏️ Actualiza value / trendValue / progress cuando tengas datos reales

export type Trend = 'up' | 'down' | 'neutral'

export interface Metric {
  id: string
  value: string       // "12.4k" | "—" para placeholder
  unit?: string       // "ton CO₂"
  label: string
  sub: string
  trend: Trend
  trendValue?: string // "+12% vs Q1"
  progress: number    // 0-100 para la barra de progreso
}

export const METRICS: Metric[] = [
  {
    id: 'co2-avoided',
    value: '—',
    unit: 'ton CO₂',
    label: 'Emisiones evitadas',
    sub: 'anuales estimadas',
    trend: 'down',
    trendValue: '—% vs ruta base',
    progress: 0,
  },
  {
    id: 'green-corridors',
    value: '—',
    label: 'Corredores verdes',
    sub: 'activos globalmente',
    trend: 'up',
    trendValue: '+— nuevos este mes',
    progress: 0,
  },
  {
    id: 'routes-optimized',
    value: '—',
    label: 'Rutas optimizadas',
    sub: 'procesadas en tiempo real',
    trend: 'up',
    trendValue: '— en proceso',
    progress: 0,
  },
  {
    id: 'suppliers',
    value: '—',
    label: 'Proveedores',
    sub: 'conectados a la red',
    trend: 'neutral',
    trendValue: 'fase piloto',
    progress: 0,
  },
]
