// ✏️ Posiciones expresadas como % del contenedor (mapa estilizado, no Mercator exacto)
// Para integrar Leaflet/Mapbox reemplaza HeatMap.tsx — estos datos quedan como referencia

export type HotspotLevel = 'critical' | 'high' | 'medium' | 'green'
export type RouteType = 'traditional' | 'optimizing' | 'green'

export interface Hotspot {
  id: string
  name: string
  x: number          // % horizontal
  y: number          // % vertical
  level: HotspotLevel
  emissions: string  // label descriptivo
}

export interface MapRoute {
  id: string
  from: string
  to: string
  fromX: number
  fromY: number
  toX: number
  toY: number
  type: RouteType
}

export const HOTSPOTS: Hotspot[] = [
  { id: 'shanghai',  name: 'Shanghai',    x: 82, y: 37, level: 'critical', emissions: 'Crítico' },
  { id: 'rotterdam', name: 'Rotterdam',   x: 51, y: 22, level: 'high',     emissions: 'Alto' },
  { id: 'la',        name: 'Los Ángeles', x: 11, y: 37, level: 'high',     emissions: 'Alto' },
  { id: 'singapore', name: 'Singapur',    x: 78, y: 53, level: 'medium',   emissions: 'Medio' },
  { id: 'dubai',     name: 'Dubai',       x: 63, y: 41, level: 'medium',   emissions: 'Medio' },
  { id: 'santos',    name: 'Santos',      x: 30, y: 64, level: 'green',    emissions: 'Bajo' },
  { id: 'newyork',   name: 'New York',    x: 22, y: 30, level: 'high',     emissions: 'Alto' },
  { id: 'hamburg',   name: 'Hamburgo',    x: 52, y: 19, level: 'green',    emissions: 'Bajo' },
]

export const MAP_ROUTES: MapRoute[] = [
  { id: 'r1', from: 'Shanghai',    to: 'Rotterdam', fromX: 82, fromY: 37, toX: 51, toY: 22, type: 'optimizing' },
  { id: 'r2', from: 'Singapur',    to: 'Rotterdam', fromX: 78, fromY: 53, toX: 51, toY: 22, type: 'green' },
  { id: 'r3', from: 'Los Ángeles', to: 'Rotterdam', fromX: 11, fromY: 37, toX: 51, toY: 22, type: 'traditional' },
  { id: 'r4', from: 'Santos',      to: 'Rotterdam', fromX: 30, fromY: 64, toX: 51, toY: 22, type: 'green' },
  { id: 'r5', from: 'New York',    to: 'Rotterdam', fromX: 22, fromY: 30, toX: 51, toY: 22, type: 'traditional' },
]
