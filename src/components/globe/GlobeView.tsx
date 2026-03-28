import { useEffect, useRef, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';

export function GlobeView({ 
  onCorridorClick, 
  selectedCorridor,
  currentMoment = 0
}: { 
  onCorridorClick?: (corridor: any) => void,
  selectedCorridor?: any,
  currentMoment?: number
}) {
  const globeRef = useRef<GlobeMethods>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [geoData, setGeoData] = useState<{ corridors: any[], ports: any[] }>({ corridors: [], ports: [] });

  // Resize observer
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Fetch GeoJSON
  useEffect(() => {
    fetch('/data/green_corridors.geojson')
      .then(res => res.json())
      .then(data => {
        const corridors = data.features.filter((f: any) => f.geometry.type === 'LineString');
        const ports = data.features.filter((f: any) => f.geometry.type === 'Point');
        setGeoData({ corridors, ports });
      });
  }, []);

  // Auto-rotation and Storytelling camera movements
  useEffect(() => {
    if (globeRef.current) {
      const globe = globeRef.current;
      
      if (!selectedCorridor) {
        // Idle mode: Auto-rotate
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;
        globe.pointOfView({ altitude: 2.5 }, 1000);
      } else {
        // Storytelling mode
        globe.controls().autoRotate = false;
        
        const coords = selectedCorridor.geometry.coordinates;
        const start = coords[0];
        const end = coords[coords.length - 1];
        const mid = coords[Math.floor(coords.length / 2)];

        switch(currentMoment) {
          case 1: // Scale (Overview)
            globe.pointOfView({ lat: mid[1], lng: mid[0], altitude: 1.8 }, 2000);
            break;
          case 2: // Problem (Zoom in slightly)
            globe.pointOfView({ lat: mid[1], lng: mid[0], altitude: 1.2 }, 3000);
            break;
          case 3: // Evidence (Zoom to Start Port Hotspot)
            globe.pointOfView({ lat: start[1], lng: start[0], altitude: 0.8 }, 2000);
            break;
          case 4: // Gap (Back to mid)
            globe.pointOfView({ lat: mid[1], lng: mid[0], altitude: 1.5 }, 2000);
            break;
          case 6: // Solution (End port arriving)
            globe.pointOfView({ lat: end[1], lng: end[0], altitude: 1.2 }, 4000);
            break;
          default:
            globe.pointOfView({ lat: mid[1], lng: mid[0], altitude: 1.8 }, 2000);
        }
      }
    }
  }, [selectedCorridor, currentMoment]);

  // Path data for better route rendering
  const pathsData = useMemo(() => {
    return geoData.corridors.map(c => ({
      coords: c.geometry.coordinates,
      color: c.properties.color,
      name: c.properties.corridor_name,
      id: c.properties.corridor_key,
      original: c
    }));
  }, [geoData.corridors]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-transparent">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        width={dimensions.width}
        height={dimensions.height}
        showAtmosphere={true}
        atmosphereColor="#37A7B3"
        atmosphereAltitude={0.15}
        
        // Paths (Improved Corridors)
        pathsData={pathsData}
        pathPoints={(d: any) => d.coords}
        pathPointLat={(p: any) => p[1]}
        pathPointLng={(p: any) => p[0]}
        pathColor={(d: any) => [d.color, d.color]}
        pathDashLength={0.1}
        pathDashGap={0.008}
        pathDashAnimateTime={2000}
        pathStroke={(d: any) => (d.original === selectedCorridor) ? 1.5 : 0.8}
        onPathClick={(d: any) => onCorridorClick?.(d.original)}
        
        // Arcs (Legacy arcs as subtle highlights if needed, or remove)
        // arcsData={selectedCorridor ? [selectedCorridor] : []}
        // ...

        // Rings (Ports & Hotspots)
        ringsData={geoData.ports}
        ringLat={(d: any) => d.geometry.coordinates[1]}
        ringLng={(d: any) => d.geometry.coordinates[0]}
        ringColor={(d: any) => {
          if (currentMoment === 3 && d.properties.port_name === selectedCorridor?.properties?.start_port) {
            return '#E63946'; // Red hotspot for Moment 3
          }
          const level = d.properties.congestion_level;
          return level === 'HIGH' ? '#E63946' : level === 'MODERATE' ? '#F4A261' : '#52B788';
        }}
        ringMaxRadius={(d: any) => {
           if (currentMoment === 3 && d.properties.port_name === selectedCorridor?.properties?.start_port) return 5;
           return Math.sqrt(d.properties.co2_total_tonnes) * 0.0001;
        }}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1500}

        // Labels
        labelsData={geoData.ports}
        labelLat={(d: any) => d.geometry.coordinates[1]}
        labelLng={(d: any) => d.geometry.coordinates[0]}
        labelText={(d: any) => d.properties.port_name}
        labelSize={(d: any) => d.properties.port_name === selectedCorridor?.properties?.start_port ? 1.5 : 1.0}
        labelDotRadius={0.4}
        labelColor={() => '#ffffff'}
        labelResolution={3}
      />
      
      {/* HUD Overlay Details - Hidden on very small screens to avoid clutter */}
      {selectedCorridor && (
        <div className="absolute top-4 lg:top-10 left-6 lg:left-10 pointer-events-none z-20 animate-in fade-in slide-in-from-left-4 duration-700 hidden sm:block">
           <div className="bg-black/40 backdrop-blur-md p-3 lg:p-4 rounded-2xl border border-white/10">
              <p className="text-[8px] lg:text-[10px] font-black text-[#37A7B3] uppercase tracking-widest mb-1">Live Tracking</p>
              <h3 className="text-sm lg:text-xl font-black text-white">{selectedCorridor.properties.corridor_label}</h3>
           </div>
        </div>
      )}
      
      {/* Sat-Link Indicator - More compact on mobile */}
      <div className="absolute top-4 lg:top-10 right-6 lg:right-10 flex items-center gap-1.5 lg:gap-2 rounded-full border border-white/10 bg-black/40 px-3 lg:px-4 py-1.5 lg:py-2 backdrop-blur-md">
        <div className="h-1 lg:h-1.5 w-1 lg:w-1.5 animate-pulse rounded-full bg-[#37A7B3]" />
        <span className="font-mono text-[7px] lg:text-[9px] font-bold tracking-widest text-white/60 uppercase">
          SAT-LINK <span className="hidden sm:inline">· Sentinel-5P active</span>
        </span>
      </div>
    </div>
  );
}
