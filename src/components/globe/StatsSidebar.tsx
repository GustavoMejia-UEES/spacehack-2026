import { GLOBAL_STATS } from './dashboardConstants';

interface StatsSidebarProps {
  corridors: any[];
  onSelect: (corridor: any) => void;
  selectedId?: string;
}

export function StatsSidebar({ corridors, onSelect, selectedId }: StatsSidebarProps) {
  return (
    <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6 p-6 bg-[#0d1117]/80 backdrop-blur-xl border-r border-white/10 overflow-y-auto custom-scrollbar h-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#52B788] animate-pulse" />
          GreenCorridor Monitor
        </h2>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">
          SpaceHack 2026 · Maritime Intelligence
        </p>
      </div>

      {/* Global Stats Panel */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Active Corridors</p>
          <p className="text-2xl font-black text-[#52B788] font-mono leading-none">{GLOBAL_STATS.active_corridors_2025}</p>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Realization Stage</p>
          <p className="text-2xl font-black text-[#F4A261] font-mono leading-none">{GLOBAL_STATS.realization_stage}</p>
        </div>
        <div className="col-span-2 bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Total CO2 Reported (Mt)</p>
          <p className="text-2xl font-black text-[#E63946] font-mono leading-none">{GLOBAL_STATS.thetis_total_co2_Mt}</p>
          <p className="text-[8px] text-white/20 mt-2 font-medium tracking-wide">Source: THETIS-MRV · EMSA</p>
        </div>
      </div>

      {/* Corridor Selector */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1 mb-2">Corridor Selector</p>
        {corridors.map((c) => (
          <button
            key={c.properties.corridor_key}
            onClick={() => onSelect(c)}
            className={`group flex flex-col gap-2 rounded-2xl border p-4 transition-all text-left ${
              selectedId === c.properties.corridor_key
                ? 'bg-white/10 border-[#37A7B3] shadow-[0_0_20px_rgba(55,167,179,0.1)]'
                : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-tight">{c.properties.corridor_name}</span>
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.properties.color }} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-white/40 font-medium">{c.properties.distance_nm} nm</span>
              <span className="text-[10px] text-white/40 font-medium border-l border-white/10 pl-3">{c.properties.typical_days} days</span>
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-1 w-4 rounded-full bg-[#37A7B3] opacity-60" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Shipping Corridor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full border border-[#E63946] shadow-[0_0_8px_#E63946]" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Port Emission Flux</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
