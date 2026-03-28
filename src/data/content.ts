// ✏️ Textos centrales de la landing — edita aquí para cambiar el copy

export const HACKATHON = {
  name: 'SpaceHack 2026',
  challenge: 'Innovating the Net-Zero Supply Chain',
  tagline: 'Descarbonizando las cadenas de suministro globales.',
  subtitle:
    'Usamos datos satelitales en tiempo real para identificar, optimizar y escalar corredores logísticos de cero emisiones netas.',
  cta: 'Ver la solución',
  ctaSecondary: 'Explorar métricas',
}

export interface Solution {
  icon: string
  title: string
  desc: string
}

// ✏️ Los 3 pilares de la solución
export const SOLUTIONS: Solution[] = [
  {
    icon: '🛰️',
    title: 'Datos Satelitales en Tiempo Real',
    desc: 'Integramos imágenes satelitales y datos ambientales para monitorear el impacto de carbono en cada tramo de la cadena de suministro.',
  },
  {
    icon: '📊',
    title: 'Dashboards Integrados',
    desc: 'Visualizaciones unificadas que conectan emisiones, rutas logísticas y proveedores en un solo panel de control accionable.',
  },
  {
    icon: '🌿',
    title: 'Green Corridors',
    desc: 'Algoritmos que identifican corredores de bajo impacto ambiental, optimizando costos y huella de carbono simultáneamente.',
  },
]
