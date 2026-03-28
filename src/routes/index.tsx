import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { GlobeView } from '../components/globe/GlobeView'
import { StorytellingEngine, NarratorHUD } from '../components/globe/StorytellingEngine'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<any | null>(null);
  const [corridors, setCorridors] = useState<any[]>([]);
  const [currentMoment, setCurrentMoment] = useState(0);

  useEffect(() => {
    fetch('/data/green_corridors.geojson')
      .then(res => res.json())
      .then(data => {
        const lineFeatures = data.features.filter((f: any) => f.geometry.type === 'LineString');
        setCorridors(lineFeatures);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a1a] overflow-hidden text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────s────── */}
      <header className={`
        ${selectedCorridor ? 'h-[56px]' : 'h-[72px] lg:h-[80px]'}
        flex-shrink-0 border-b border-white/8 bg-[#0d1117]/80 backdrop-blur-xl
        relative z-20 transition-all duration-500
      `}>
        <div className="h-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between gap-4">

          {/* Left — Back button or spacer */}
          <div className="w-32 lg:w-44 flex-shrink-0">
            {selectedCorridor && (
              <button
                onClick={() => { setSelectedCorridor(null); setCurrentMoment(0); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[9px] lg:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
              >
                <span>←</span>
                <span className="hidden sm:inline">Overview</span>
              </button>
            )}
          </div>

          {/* Center — Logo (cropped via overflow hidden + object-cover trick) */}
          <div className="flex-1 flex items-center justify-center">
            {!selectedCorridor ? (
              /* Idle: big logo, overflow hidden to cut the built-in PNG padding */
              <div className="overflow-hidden" style={{ width: 200, height: 52 }}>
                <img
                  src="/src/assets/logo-NAEVCO.png"
                  alt="NAEVCO"
                  style={{
                    width: 260,
                    marginLeft: -30,
                    marginTop: -18,
                    objectFit: 'contain',
                    filter: 'brightness(1.1)',
                  }}
                />
              </div>
            ) : (
              /* Active: small logo + corridor name */
              <div className="flex items-center gap-3">
                <div className="overflow-hidden" style={{ width: 100, height: 28 }}>
                  <img
                    src="/src/assets/logo-NAEVCO.png"
                    alt="NAEVCO"
                    style={{ width: 130, marginLeft: -15, marginTop: -9, objectFit: 'contain' }}
                  />
                </div>
                <div className="h-4 w-px bg-white/15" />
                <span
                  className="text-[10px] sm:text-sm font-black uppercase tracking-tight truncate max-w-[90px] sm:max-w-[220px] lg:max-w-none"
                  style={{ color: selectedCorridor.properties.color }}
                >
                  {selectedCorridor.properties.corridor_name}
                </span>
              </div>
            )}
          </div>

          {/* Right — Quote or empty spacer */}
          <div className="w-32 lg:w-44 flex-shrink-0 flex justify-end">
            {!selectedCorridor && (
              <p className="hidden lg:block text-[10px] font-medium text-white/30 leading-relaxed italic text-right max-w-[160px]">
                "What's missing is monitoring."
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── GLOBE ──────────────────────────────────────────────────────────── */}
      <main className="flex-1 relative overflow-hidden z-10">
        <GlobeView
          selectedCorridor={selectedCorridor}
          onCorridorClick={setSelectedCorridor}
          currentMoment={currentMoment}
        />
        <div className="absolute bottom-4 left-6 z-20 pointer-events-none">
          <p className="text-[8px] font-medium text-white/20 uppercase tracking-[0.2em] bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
            OECD Maritime CO₂ · THETIS-MRV 2023 · G2Z Coalition
          </p>
        </div>
      </main>

      {/* ── NARRATOR HUD (fixed — Seagull + Speech Bubble) ─────────────────── */}
      <NarratorHUD currentMoment={currentMoment} selectedCorridor={selectedCorridor} />

      {/* ── TACTICAL DATA PANEL ────────────────────────────────────────────── */}
      <footer className={`
        ${selectedCorridor ? 'h-[20vh] min-h-[145px]' : 'h-[20vh] min-h-[145px]'}
        flex-shrink-0 border-t border-white/8 bg-[#080b12]/96 backdrop-blur-2xl
        relative z-20 overflow-hidden transition-all duration-500
      `}>
        <StorytellingEngine
          corridors={corridors}
          selectedCorridor={selectedCorridor}
          onSelect={setSelectedCorridor}
          currentMoment={currentMoment}
          onMomentChange={setCurrentMoment}
        />
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
