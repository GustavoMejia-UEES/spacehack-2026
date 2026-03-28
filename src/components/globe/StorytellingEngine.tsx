import { useEffect, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Seagull } from '../../features/character/models/Seagull';
import { FUEL_SCENARIOS } from './dashboardConstants';
import {
  FaShip,
  FaAnchor,
  FaMountain,
  FaLeaf,
  FaGlobeAmericas,
  FaChevronRight,
} from 'react-icons/fa';

interface StorytellingEngineProps {
  corridors: any[];
  selectedCorridor: any | null;
  onSelect: (corridor: any) => void;
  currentMoment: number;
  onMomentChange: (moment: number) => void;
}

interface NarratorHUDProps {
  currentMoment: number;
  selectedCorridor: any | null;
}

const SEAGULL_CONFIG = {
  rotation: [0.15, 0.5, 0.05] as [number, number, number],
  scale: 0.28,
  position: [0, -0.3, 0] as [number, number, number],
  mobileScale: 0.32,
};

const NARRATIVE_SCRIPT: Record<number, (p: any) => string> = {
  1: (p) =>
    `Locking onto ${p.corridor_name}. Detecting ~${Math.round(p.annual_voyages_est / 365)} vessels departing every single day. That's the volume we're tracking.`,
  2: (p) =>
    `Atmospheric breach confirmed. ${p.co2_annual_2024_Gt} Gt of CO₂ annually — and rising ${p.co2_yoy_2024_pct}% year-over-year. The atmosphere doesn't lie.`,
  3: (p) =>
    `Sentinel-5P sensors at ${p.start_port} show 180 μmol NO₂. That's 15× the expected baseline. Something is burning there — and it's not in any report.`,
  4: (p) =>
    `Trajectory is diverging. We're ${Math.round(p.gap_to_imo_2030_t / 1000000)} Mt away from the IMO 2030 target. The gap is real and widening.`,
  5: (p) =>
    `${p.g2z_signatories_count} verified signatories are doing the work. Coalition credibility shield: confirmed active.`,
  6: (p) =>
    `With green fuels at scale, this corridor could cut ~${Math.round(p.co2_saved_green_ammonia_t / 1000000000 * 10) / 10} Gt annually. The math checks out.`,
  7: () =>
    `"Transparency is the engine of change." Analysis complete. Data locked. Mission verified.`,
};

function useTypingText(text: string, speed = 20) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    setIsTyping(true);
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else { setIsTyping(false); clearInterval(iv); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return { displayed, isTyping };
}

/* ─────────────────────────────────────────────────────────────────────────────
   NARRATOR HUD — desktop only (hidden lg:block)
───────────────────────────────────────────────────────────────────────────── */
export function NarratorHUD({ currentMoment, selectedCorridor }: NarratorHUDProps) {
  const p = selectedCorridor?.properties;
  const narrativeText = p && currentMoment >= 1 && currentMoment <= 7
    ? (NARRATIVE_SCRIPT[currentMoment]?.(p) ?? '') : '';
  const { displayed, isTyping } = useTypingText(narrativeText, 20);

  const animName =
    currentMoment === 7 ? 'ArmatureAction.006'
    : currentMoment === 2 ? 'ArmatureAction.001'
    : currentMoment === 1 ? 'ArmatureAction'
    : 'ArmatureAction.002';

  if (!selectedCorridor || currentMoment === 0) return null;

  return (
    <>
      {/* ─── MOBILE: horizontal strip at the top-edge of the footer ─────── */}
      <div
        className="lg:hidden fixed left-0 right-0 z-[9999] pointer-events-none select-none flex items-end px-3.5 gap-2.5"
        style={{ bottom: '20vh' }}
      >
        {/* Speech bubble — left of bird */}
        {narrativeText && (
          <div className="flex-1 bg-[#06090f]/90 backdrop-blur-md border border-[#37A7B3]/15 rounded-2xl px-3 py-2.5 mb-2 animate-in fade-in duration-500">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="h-[2px] w-2.5 bg-[#37A7B3] rounded-full" />
              <span className="text-[6px] font-black text-[#37A7B3]/50 uppercase tracking-[0.2em]">NAEV · Intel</span>
            </div>
            <p className="text-[9.5px] text-white/62 leading-[1.52]">
              {displayed}
              {isTyping && <span className="inline-block w-[2px] h-[9px] bg-[#37A7B3] ml-0.5 animate-pulse align-middle" />}
            </p>
          </div>
        )}
        {/* Bird canvas — right side */}
        <div className="flex-shrink-0 w-[130px] h-[120px]">
          <Canvas camera={{ position: [0, 0.5, 7], fov: 40 }} style={{ pointerEvents: 'none' }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1.6} />
              <directionalLight position={[-3, 3, 3]} intensity={1} />
              <Seagull
                position={SEAGULL_CONFIG.position}
                scale={SEAGULL_CONFIG.mobileScale}
                rotation={SEAGULL_CONFIG.rotation}
                animationName={animName}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* ─── DESKTOP: full-size fixed bottom-right ────────────────────────── */}
      <div className="hidden lg:block fixed bottom-0 right-0 w-[440px] h-[400px] z-[9999] pointer-events-none select-none">
        {/* Speech Bubble */}
        {narrativeText && (
          <div
            key={`bubble-${currentMoment}`}
            className="absolute bottom-[270px] right-[120px] w-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            <div className="bg-[#070b12]/94 backdrop-blur-xl border border-[#37A7B3]/20 rounded-[1.3rem] rounded-br-[0.25rem] px-4 py-3 shadow-[0_6px_28px_rgba(55,167,179,0.14)]">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="h-[2px] w-3 bg-[#37A7B3] rounded-full" />
                <span className="text-[6.5px] font-black text-[#37A7B3]/50 uppercase tracking-[0.3em]">NAEV · Intel</span>
              </div>
              <p className="text-[12px] text-white/82 leading-[1.65]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {displayed}
                {isTyping && <span className="inline-block w-[2px] h-[10px] bg-[#37A7B3] ml-0.5 animate-pulse align-middle" />}
              </p>
            </div>
            <div className="absolute bottom-[-5px] right-4 w-2.5 h-2.5 bg-[#070b12]/94 border-r border-b border-[#37A7B3]/20 rotate-45" />
          </div>
        )}
        {/* 3D Seagull */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0.5, 7], fov: 40 }} shadows style={{ pointerEvents: 'none' }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1.8} />
              <spotLight position={[5, 8, 8]} angle={0.2} penumbra={1} intensity={2.5} castShadow />
              <directionalLight position={[-3, 3, 3]} intensity={0.8} />
              <Seagull
                position={SEAGULL_CONFIG.position}
                scale={SEAGULL_CONFIG.scale}
                rotation={SEAGULL_CONFIG.rotation}
                animationName={animName}
              />
            </Suspense>
          </Canvas>
        </div>
        {/* Intel progress */}
        <div className="absolute bottom-12 left-5 flex flex-col gap-1">
          <span className="text-[6.5px] font-black text-[#37A7B3]/35 uppercase tracking-[0.35em]">Intel {currentMoment}/7</span>
          <div className="h-[2px] w-14 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#37A7B3] transition-all duration-1000" style={{ width: `${(currentMoment / 7) * 100}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED CARD COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

function Card({
  label, value, unit, sub, accent, pulse = false, wide = false,
}: {
  label: string; value: React.ReactNode; unit?: string; sub?: string;
  accent?: string; pulse?: boolean; wide?: boolean;
}) {
  return (
    <div className={`${wide ? 'flex-[2]' : 'flex-1'} bg-white/[0.035] rounded-xl border border-white/[0.07] p-3 flex flex-col gap-1.5 min-w-0`}>
      <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">{label}</p>
      <p className={`text-3xl font-black leading-none tracking-tight ${pulse ? 'animate-pulse' : ''}`}
        style={{ color: accent ?? 'white' }}>
        {value}
        {unit && <small className="text-[38%] opacity-30 ml-1 font-bold tracking-normal">{unit}</small>}
      </p>
      {sub && <p className="text-[7.5px] font-bold text-white/22 uppercase tracking-widest mt-0.5">{sub}</p>}
    </div>
  );
}

function BarCard({ label, pct, color, sub }: { label: string; pct: number; color: string; sub?: string }) {
  return (
    <div className="flex-1 bg-white/[0.035] rounded-xl border border-white/[0.07] p-3 flex flex-col gap-1.5 min-w-0">
      <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">{label}</p>
      <p className="text-3xl font-black leading-none" style={{ color }}>-{pct}%</p>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      {sub && <p className="text-[7px] font-bold text-white/18 uppercase tracking-widest">{sub}</p>}
    </div>
  );
}

/** Mini data chip — used on the mobile right column (under the bird) */
function Chip({
  label, value, accent, pulse = false,
}: {
  label: string; value: string; accent?: string; pulse?: boolean;
}) {
  return (
    <div className="bg-white/[0.05] rounded-lg border border-white/[0.07] px-2.5 py-1.5 flex flex-col gap-0.5">
      <p className="text-[7px] font-black text-white/28 uppercase tracking-[0.18em] leading-none">{label}</p>
      <p className={`text-base font-black leading-none tracking-tight ${pulse ? 'animate-pulse' : ''}`}
        style={{ color: accent ?? 'white' }}>
        {value}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN STORYTELLING ENGINE
───────────────────────────────────────────────────────────────────────────── */
export function StorytellingEngine({
  corridors, selectedCorridor, onSelect, currentMoment, onMomentChange,
}: StorytellingEngineProps) {

  useEffect(() => {
    if (selectedCorridor) onMomentChange(1); else onMomentChange(0);
  }, [selectedCorridor]);

  useEffect(() => {
    if (!selectedCorridor || currentMoment === 0 || currentMoment === 7) return;
    const t = setTimeout(() => onMomentChange(Math.min(currentMoment + 1, 7)), currentMoment === 1 ? 5000 : 9000);
    return () => clearTimeout(t);
  }, [currentMoment, selectedCorridor]);

  /* ── IDLE: corridor selection ─────────────────────────────────────────── */
  if (!selectedCorridor) {
    const COR_ICONS = [FaShip, FaAnchor, FaMountain];
    const COR_NUMS = ['01', '02', '03'];

    return (
      <div className="h-full w-full flex flex-col overflow-hidden animate-in fade-in duration-700"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ── MOBILE idle ────────────────────────────────────────────────── */}
        <div className="md:hidden flex flex-col h-full px-4 pt-3 pb-2 gap-2 overflow-hidden">
          <div className="flex-shrink-0">
            <h3 className="text-[#37A7B3] font-black text-xs uppercase tracking-[0.3em] mb-0.5">Select a Corridor</h3>
            <p className="text-white/30 text-[9.5px] font-medium">3 green shipping routes — tap to analyze.</p>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            {corridors.map((c, idx) => {
              const IconComp = COR_ICONS[idx % 3] ?? FaGlobeAmericas;
              return (
                <button
                  key={c.properties.corridor_key}
                  onClick={() => onSelect(c)}
                  className="group relative flex items-center gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] px-3.5 py-3 text-left overflow-hidden hover:bg-white/[0.06] transition-all active:scale-[0.98] flex-1 min-h-0"
                  style={{ borderLeft: `3px solid ${c.properties.color}` }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(ellipse at left, ${c.properties.color}18, transparent 65%)` }} />
                  {/* Number badge */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] font-black opacity-25 tabular-nums">{COR_NUMS[idx]}</span>
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${c.properties.color}22`, border: `1px solid ${c.properties.color}40` }}>
                      <IconComp style={{ color: c.properties.color }} size={14} />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] font-black text-white uppercase tracking-tight leading-tight">
                      {c.properties.corridor_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[8.5px] text-white/30 font-bold uppercase">
                        {c.properties.distance_nm.toLocaleString()} nm
                      </span>
                      <span className="text-white/15">·</span>
                      <span className="text-[8.5px] text-white/30 font-bold uppercase">
                        {c.properties.typical_days} days
                      </span>
                      <span className="text-white/15">·</span>
                      <span className="text-[8.5px] font-bold uppercase" style={{ color: c.properties.color }}>
                        {c.properties.cii_grade_2023} grade
                      </span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <FaChevronRight size={10} className="text-white/15 flex-shrink-0 group-hover:text-white/40 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DESKTOP idle ────────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-row items-center h-full px-10 gap-8">
          <div className="flex-shrink-0 max-w-[240px]">
            <h3 className="text-[#37A7B3] font-black text-xs uppercase tracking-[0.35em] mb-1">Select a Corridor</h3>
            <p className="text-white/30 text-[11px] font-medium leading-relaxed">
              Choose a green shipping route to begin satellite intelligence analysis.
            </p>
          </div>
          <div className="flex flex-row gap-3.5">
            {corridors.map((c, idx) => {
              const IconComp = COR_ICONS[idx % 3] ?? FaGlobeAmericas;
              return (
                <button
                  key={c.properties.corridor_key}
                  onClick={() => onSelect(c)}
                  className="group relative flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 min-w-[220px] hover:bg-white/[0.07] hover:border-[#37A7B3]/35 transition-all text-left overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle at top right, ${c.properties.color}12, transparent 60%)` }} />
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center border border-white/[0.07] bg-black/30 group-hover:border-[#37A7B3]/30 transition-all">
                      <IconComp style={{ color: c.properties.color }} size={15} />
                    </div>
                    <span className="text-[9px] font-black text-white/20 tabular-nums">{COR_NUMS[idx]}</span>
                  </div>
                  <p className="text-[10.5px] font-black text-white uppercase tracking-tight leading-tight">
                    {c.properties.corridor_name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8.5px] text-white/32 font-bold uppercase">
                      {c.properties.distance_nm.toLocaleString()} nm · {c.properties.typical_days}d
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const p = selectedCorridor.properties;

  /* Desktop row: content fills naturally left → invisible spacer div reserves right zone for seagull */
  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="h-full flex items-stretch gap-2.5 px-5 lg:px-7 py-2 animate-in fade-in slide-in-from-bottom-2 duration-400">
      {children}
      {/* Transparent spacer — seagull HUD floats here, no pr hack needed */}
      <div className="w-[440px] flex-shrink-0" aria-hidden="true" />
    </div>
  );

  /* Mobile right-column chips per moment */
  const MobileChips = ({ moment, props: q }: { moment: number; props: any }) => {
    if (moment === 1) return (<>
      <Chip label="Voyages/yr" value={q.annual_voyages_est?.toLocaleString()} />
      <Chip label="Vessels/day" value={`~${Math.round(q.annual_voyages_est / 365)}`} accent="#37A7B3" />
      <Chip label="Distance" value={`${q.distance_nm.toLocaleString()} nm`} />
    </>);
    if (moment === 2) return (<>
      <Chip label="CO₂ Total" value={`${q.co2_annual_2024_Gt} Gt`} accent="#E63946" pulse />
      <Chip label="YoY" value={`+${q.co2_yoy_2024_pct}%`} accent="#E63946" />
      <Chip label="CII 2023" value={q.cii_grade_2023} accent={q.cii_grade_2023 === 'D' || q.cii_grade_2023 === 'E' ? '#E63946' : '#52B788'} />
    </>);
    if (moment === 3) return (<>
      <Chip label="NO₂" value="180 μmol" accent="#E63946" />
      <Chip label="vs base" value="15×" accent="#E63946" />
      <Chip label="CII gap" value={`${q.cii_gap_to_2030_pct}%`} accent="#F4A261" />
    </>);
    if (moment === 4) return (<>
      <Chip label="Gap IMO" value={`${Math.round(q.gap_to_imo_2030_t / 1000000)} Mt`} accent="#F4A261" />
      <Chip label="Red. pot." value={`${q.co2_reduction_potential_pct}%`} accent="#37A7B3" />
    </>);
    if (moment === 5) return (<>
      <Chip label="Signat." value={String(q.g2z_signatories_count)} accent="#52B788" />
      <Chip label="Score" value={`${q.g2z_composite_score}%`} accent="#52B788" />
    </>);
    if (moment === 6) return (<>
      <Chip label="Abatement" value={`${Math.round(q.co2_saved_green_ammonia_t / 1000000)} Mt`} />
      <Chip label="Red. pot." value={`${q.co2_reduction_potential_pct}%`} accent="#37A7B3" />
    </>);
    if (moment === 7) return (
      <div className="col-span-2 bg-[#37A7B3]/10 border border-[#37A7B3]/20 rounded-xl p-2.5 text-center">
        <p className="text-[8px] font-black text-[#37A7B3] uppercase tracking-widest">✓ Mission Verified</p>
        <p className="text-[7px] text-white/30 uppercase mt-0.5">Use buttons below to continue</p>
      </div>
    );
    return null;
  };

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT
          ════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-full overflow-hidden">

        {/* — Phase label + dots ——————————————————————————————————————————— */}
        <div className="flex items-center justify-between px-4 pt-2.5 pb-2 flex-shrink-0 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#37A7B3] animate-pulse" />
            <span className="text-[8px] font-black text-[#37A7B3] uppercase tracking-[0.25em]">
              {['', 'Scale', 'CO₂', 'Evidence', 'Gap', 'Progress', 'Forecast', 'Done'][currentMoment]}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map(m => (
              <div key={m} onClick={() => onMomentChange(m)}
                className={`h-1 rounded-full cursor-pointer transition-all ${m === currentMoment ? 'w-5 bg-[#37A7B3]' : 'w-1.5 bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* — Main content: ONLY data chips (message now lives in NarratorHUD above) — */}
        <div className="flex-1 px-3.5 py-2 overflow-hidden min-h-0">
          <div className="grid grid-cols-2 gap-2 h-full content-start">
            <MobileChips moment={currentMoment} props={p} />
          </div>
        </div>

        {/* — Prev / Next nav ———————————————————————————————————————————— */}
        <div className="flex gap-2 px-3.5 py-2.5 border-t border-white/[0.05] flex-shrink-0">
          <button onClick={() => onMomentChange(Math.max(currentMoment - 1, 1))} disabled={currentMoment === 1}
            className="flex-1 bg-white/[0.04] border border-white/[0.06] py-2.5 rounded-xl text-[8.5px] uppercase disabled:opacity-20 font-black">
            ← Prev
          </button>
          {currentMoment === 7 ? (
            <button
              onClick={() => onSelect(null)}
              className="flex-[2] bg-[#37A7B3] text-[#050812] font-black py-2.5 rounded-xl text-[8.5px] uppercase tracking-widest"
            >
              Pick a Corridor →
            </button>
          ) : (
            <button onClick={() => onMomentChange(Math.min(currentMoment + 1, 7))}
              className="flex-[2] bg-[#37A7B3] text-[#050812] font-black py-2.5 rounded-xl text-[8.5px] uppercase tracking-widest">
              Next →
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT
          ════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col h-full">

        {/* Phase label + nav dots */}
        <div className="flex items-center justify-between px-5 lg:px-7 pt-2.5 pb-1 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#37A7B3] animate-pulse" />
            <span className="text-[8px] font-black text-[#37A7B3] uppercase tracking-[0.25em]">
              {['', 'Scale', 'CO₂ Breach', 'EO Evidence', 'Climate Gap', 'G2Z Progress', 'Mitigation', 'Mission'][currentMoment]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map(m => (
                <div key={m} onClick={() => onMomentChange(m)}
                  className={`h-1 rounded-full cursor-pointer transition-all duration-400 ${m === currentMoment ? 'w-7 bg-[#37A7B3]' : 'w-1.5 bg-white/10 hover:bg-white/20'}`} />
              ))}
            </div>
            <div className="flex gap-1.5 items-center">
              <button onClick={() => onMomentChange(Math.max(currentMoment - 1, 1))} disabled={currentMoment <= 1}
                className="h-6 w-6 rounded-full border border-white/10 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all text-xs flex items-center justify-center">←</button>
              {currentMoment >= 7 ? (
                <button onClick={() => onSelect(null)}
                  className="h-6 px-2.5 rounded-full border border-[#37A7B3]/50 text-[#37A7B3] hover:bg-[#37A7B3]/15 transition-all text-[8px] font-black uppercase tracking-wider flex items-center">
                  Next Corridor →
                </button>
              ) : (
                <button onClick={() => onMomentChange(Math.min(currentMoment + 1, 7))}
                  className="h-6 w-6 rounded-full border border-[#37A7B3]/35 text-[#37A7B3] hover:bg-[#37A7B3]/15 transition-all text-xs flex items-center justify-center">→</button>
              )}
            </div>
          </div>
        </div>

        {/* Cards row — pr-[460px] keeps right side clear for NarratorHUD seagull */}
        <div className="flex-1 min-h-0">

          {currentMoment === 1 && (
            <Row>
              <div className="flex-[2] bg-white/[0.035] rounded-xl border border-white/[0.07] p-3 flex flex-col gap-2">
                <p className="text-[8px] font-black text-white/28 uppercase tracking-[0.2em]">Annual Operations</p>
                <div>
                  <p className="text-4xl font-black text-white leading-none">{p.annual_voyages_est?.toLocaleString()}</p>
                  <p className="text-[7.5px] text-white/18 uppercase font-bold tracking-widest mt-0.5">ops / yr</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#37A7B3] animate-pulse" />
                  <span className="text-base font-black text-[#37A7B3]">~{Math.round(p.annual_voyages_est / 365)}</span>
                  <span className="text-[7.5px] text-white/22 uppercase font-bold">vessels/day</span>
                </div>
              </div>
              <Card label="Distance" value={p.distance_nm?.toLocaleString()} unit="nm" />
              <Card label="Transit" value={p.typical_days} unit="days" />
              <Card label="Vessel Type" value={<span className="text-xl leading-none">{p.cii_dominant_vessel}</span>} />
            </Row>
          )}

          {currentMoment === 2 && (
            <Row>
              <div className="flex-[2] bg-[#E63946]/[0.05] rounded-xl border border-[#E63946]/14 p-3 flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 bg-[#E63946]/18 px-2.5 py-1 rounded-full border border-[#E63946]/22 self-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E63946] animate-ping" />
                  <span className="text-[7px] font-black text-[#E63946] uppercase tracking-widest">Surge Detected</span>
                </div>
                <div>
                  <p className="text-[7.5px] text-white/22 uppercase font-black tracking-widest mb-0.5">Total CO₂ · 2024</p>
                  <p className="text-4xl font-black text-[#E63946] leading-none animate-pulse">
                    {p.co2_annual_2024_Gt}<small className="text-xl ml-1 opacity-32"> Gt</small>
                  </p>
                </div>
                <p className="text-[7px] text-white/18 uppercase font-bold">OECD Maritime CO₂ data</p>
              </div>
              <Card label="YoY Increase" value={`+${p.co2_yoy_2024_pct}%`} accent="#E63946" />
              <Card label="CO₂ / Voyage" value={`${Math.round(p.co2_per_voyage_t / 1000)}k`} unit="t" />
              <div className="flex-1 bg-white/[0.035] rounded-xl border border-white/[0.07] p-3 flex flex-col gap-1.5">
                <p className="text-[8px] font-black text-white/28 uppercase tracking-[0.2em]">CII 2023</p>
                <span className={`text-4xl font-black leading-none ${p.cii_grade_2023 === 'A' ? 'text-[#52B788]' : p.cii_grade_2023 === 'B' ? 'text-[#37A7B3]' : p.cii_grade_2023 === 'C' ? 'text-[#F97316]' : 'text-[#E63946]'}`}>
                  {p.cii_grade_2023}
                </span>
                <p className="text-[7px] text-white/18 uppercase font-bold">Carbon Intensity</p>
              </div>
            </Row>
          )}

          {currentMoment === 3 && (
            <Row>
              <div className="flex-[2] bg-black/22 rounded-xl border border-[#E63946]/18 p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#E63946] animate-ping" />
                  <span className="text-[7.5px] font-black text-white/28 uppercase tracking-widest">Sentinel-5P · {p.start_port}</span>
                </div>
                <div>
                  <p className="text-[7.5px] font-black text-[#E63946]/45 uppercase tracking-widest mb-0.5">NO₂ Column Density</p>
                  <p className="text-4xl font-black text-[#E63946] leading-none">180<small className="text-xl ml-1 text-white/18 font-bold"> μmol</small></p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-[#E63946]/18" />
                  <span className="text-[7px] font-black text-[#E63946]/40 uppercase">15× baseline</span>
                  <div className="h-px flex-1 bg-[#E63946]/18" />
                </div>
              </div>
              <div className="flex-1 bg-white/[0.035] rounded-xl border border-white/[0.07] p-3 flex flex-col gap-1.5">
                <p className="text-[8px] font-black text-white/28 uppercase tracking-[0.2em]">CII Grade</p>
                <span className={`text-4xl font-black leading-none ${p.cii_grade_2023 === 'A' ? 'text-[#52B788]' : p.cii_grade_2023 === 'B' ? 'text-[#37A7B3]' : 'text-[#E63946]'}`}>
                  {p.cii_grade_2023}
                </span>
                <p className="text-[7px] text-white/18 uppercase font-bold">2023</p>
              </div>
              <Card label="CII Actual" value={p.cii_actual_2023} unit="g/t·nm" />
              <Card label="Off 2030 Target" value={`${p.cii_gap_to_2030_pct}%`} accent="#F4A261" />
            </Row>
          )}

          {currentMoment === 4 && (
            <Row>
              <div className="flex-[2] bg-white/[0.035] rounded-xl border border-[#F4A261]/14 p-3 flex flex-col gap-2">
                <p className="text-[7.5px] font-black text-[#F4A261]/45 uppercase tracking-[0.2em]">Abatement Gap · IMO 2030</p>
                <p className="text-4xl font-black text-white leading-none">
                  {Math.round(p.gap_to_imo_2030_t / 1000000)}<small className="text-xl ml-1 opacity-20 font-bold"> Mt</small>
                </p>
                <div>
                  <div className="flex justify-between text-[7px] font-bold text-white/22 uppercase mb-1">
                    <span>Current</span><span>IMO 2030 (–30%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#E63946] via-[#F4A261] to-[#52B788]/20" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>
              <Card label="CII Off-Target" value={`${p.cii_gap_to_2030_pct}%`} accent="#F4A261" />
              <Card label="Reduction Potential" value={`${p.co2_reduction_potential_pct}%`} accent="#37A7B3" />
              <Card label="Post LNG+Wind" value={`${Math.round(p.co2_after_lng_wind_tonnes / 1e9 * 100) / 100}`} unit="Gt" />
            </Row>
          )}

          {currentMoment === 5 && (
            <Row>
              <div className="flex-1 bg-[#52B788]/[0.05] rounded-xl border border-[#52B788]/14 p-3 flex flex-col gap-2">
                <p className="text-[7.5px] font-black text-[#52B788]/45 uppercase tracking-[0.2em]">G2Z Signatories</p>
                <p className="text-5xl font-black text-white leading-none">{p.g2z_signatories_count}</p>
                <p className="text-[7px] font-black text-[#52B788]/38 uppercase tracking-widest">Verified active</p>
              </div>
              <Card label="Readiness Score" value={`${p.g2z_composite_score}%`} accent="#52B788" />
              <div className="flex-1 bg-white/[0.035] rounded-xl border border-white/[0.07] p-3 flex flex-col gap-2">
                <p className="text-[8px] font-black text-white/28 uppercase tracking-[0.2em]">G2Z Stage</p>
                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest self-start ${p.g2z_stage_numeric >= 4 ? 'bg-[#52B788]/18 text-[#52B788]' : p.g2z_stage_numeric >= 2 ? 'bg-[#F4A261]/18 text-[#F4A261]' : 'bg-[#E63946]/18 text-[#E63946]'}`}>
                  {p.g2z_stage}
                </span>
                {p.g2z_fuel_deployed_2023_t > 0 && (
                  <p className="text-xl font-black text-white">{p.g2z_fuel_deployed_2023_t?.toLocaleString()} <small className="text-sm opacity-22">t</small></p>
                )}
                <p className="text-[7px] text-white/18 uppercase font-bold">G2Z Coalition 2025</p>
              </div>
              <div className="flex-[1.5] bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 flex flex-col gap-1.5">
                <p className="text-[8px] font-black text-white/28 uppercase tracking-[0.2em]">Key Milestone</p>
                <p className="text-[9.5px] text-white/52 font-medium italic leading-relaxed flex-1">"{p.g2z_key_milestone}"</p>
                <p className="text-[7px] text-white/18 uppercase font-bold">Getting to Zero Coalition</p>
              </div>
            </Row>
          )}

          {currentMoment === 6 && (
            <Row>
              <div className="flex-1 bg-white/[0.035] rounded-xl border border-[#37A7B3]/14 p-3 flex flex-col gap-2">
                <p className="text-[7.5px] font-black text-[#37A7B3]/45 uppercase tracking-[0.2em]">Max Abatement · Green NH₃</p>
                <p className="text-4xl font-black text-white leading-none">
                  {Math.round(p.co2_saved_green_ammonia_t / 1000000)}<small className="text-xl ml-1 opacity-20 font-bold"> Mt</small>
                </p>
                <p className="text-[7px] text-white/18 uppercase font-bold">{p.co2_reduction_potential_pct}% reduction potential</p>
              </div>
              {Object.entries(FUEL_SCENARIOS).map(([name, data]: [string, any]) => (
                <BarCard key={name} label={name} pct={data.reduction * 100} color={data.color} sub={`TRL ${data.trl} · ${data.status}`} />
              ))}
            </Row>
          )}

          {currentMoment === 7 && (
            <Row>
              <div className="flex-[2] flex flex-col gap-3 py-0.5">
                <div className="flex items-center gap-2">
                  <FaLeaf size={9} className="text-[#37A7B3]" />
                  <span className="text-[8px] font-black text-[#37A7B3] uppercase tracking-[0.25em]">Terminal Closure · Mission Verified</span>
                </div>
                <p className="text-3xl font-black text-white leading-[0.92] tracking-tight uppercase italic">
                  "Transparency is the <span className="text-[#37A7B3]">Engine</span> of Change."
                </p>
                <p className="text-[7.5px] font-bold text-white/18 tracking-[0.25em] uppercase">System Verified · NAEVCO Intelligence</p>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                <button
                  onClick={() => onSelect(null)}
                  className="w-full bg-[#37A7B3] text-[#050812] font-black h-12 rounded-xl hover:scale-[1.02] transition-all uppercase tracking-[0.25em] text-[9px] shadow-[0_0_28px_rgba(55,167,179,0.3)]"
                >
                  Close Mission Report
                </button>
                <button
                  onClick={() => { const i = corridors.findIndex(c => c.properties.corridor_key === p.corridor_key); onSelect(corridors[(i + 1) % corridors.length]); }}
                  className="w-full bg-white/[0.04] border border-white/10 text-white font-black h-9 rounded-xl hover:bg-white/[0.07] transition-all uppercase tracking-[0.15em] text-[8.5px]"
                >
                  Next Corridor →
                </button>
              </div>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}
