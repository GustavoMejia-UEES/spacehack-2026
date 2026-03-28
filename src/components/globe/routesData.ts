export interface GlobeRoute {
  id: string;
  name: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  status: 'critical' | 'optimizing' | 'green';
  description: string;
}

export const GLOBE_ROUTES: GlobeRoute[] = [
  {
    id: 'sha-la',
    name: 'Shanghai - Los Angeles',
    startLat: 31.2304,
    startLng: 121.4737,
    endLat: 34.0522,
    endLng: -118.2437,
    color: '#ef4444', // Red (Critical)
    status: 'critical',
    description: 'Ruta transpacífica con alta densidad de NO2 detectada en puertos de origen.'
  },
  {
    id: 'rot-sin',
    name: 'Rotterdam - Singapore',
    startLat: 51.9244,
    startLng: 4.4777,
    endLat: 1.3521,
    endLng: 103.8198,
    color: '#f97316', // Orange (Optimizing)
    status: 'optimizing',
    description: 'Corredor Euro-Asiático en proceso de descarbonización mediante cold ironing.'
  },
  {
    id: 'syd-sha',
    name: 'Australia - Asia Central',
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 31.2304,
    endLng: 121.4737,
    color: '#22c55e', // Green (Eco)
    status: 'green',
    description: 'Ruta piloto Green Corridor utilizando biocombustibles verificados por Sentinel-5P.'
  }
];

export const PORT_MARKERS = [
  { id: 'CNSHA', name: 'Shanghai', lat: 31.2304, lng: 121.4737, size: 0.5, color: '#ef4444' },
  { id: 'USLAX', name: 'Los Angeles', lat: 34.0522, lng: -118.2437, size: 0.4, color: '#f97316' },
  { id: 'NLRTM', name: 'Rotterdam', lat: 51.9244, lng: 4.4777, size: 0.5, color: '#22c55e' },
  { id: 'SGSIN', name: 'Singapore', lat: 1.3521, lng: 103.8198, size: 0.6, color: '#f97316' },
  { id: 'AUSYD', name: 'Sydney', lat: -33.8688, lng: 151.2093, size: 0.3, color: '#22c55e' }
];
