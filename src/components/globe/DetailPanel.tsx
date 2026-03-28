import { FUEL_SCENARIOS } from './dashboardConstants';

interface DetailPanelProps {
  corridor: any | null;
  onClose: () => void;
}

export function DetailPanel({ corridor, onClose }: DetailPanelProps) {
  if (!corridor) return null;

  const props = corridor.properties;

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-full sm:w-[380px] bg-[#0d1117]/90 backdrop-blur-2xl border-l border-white/20 z-50 overflow-y-auto animate-in slide-in-from-right-10 duration-500 shadow-2xl">
      {/* Header */}
      <div className="relative p-6 pt-12" style={{ backgroundColor: `${props.color}20` }}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all transition-colors"
        >
          ✕
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: props.color }}>
          Monitoring Corridor
        </span>
        <h2 className="text-3xl font-black text-white leading-none tracking-tight">
          {props.corridor_name}
        </h2>
        <div className="flex gap-4 mt-6">
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase">Distance</p>
            <p className="text-sm font-bold text-white font-mono">{props.distance_nm} nm</p>
          </div>
          <div className="border-l border-white/10 pl-4">
            <p className="text-[9px] font-bold text-white/30 uppercase">Transit</p>
            <p className="text-sm font-bold text-white font-mono">{props.typical_days} days</p>
          </div>
          <div className="border-l border-white/10 pl-4">
            <p className="text-[9px] font-bold text-white/30 uppercase">Vessel</p>
            <p className="text-sm font-bold text-white">{props.cii_dominant_vessel}</p>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-10">
        {/* Section 1: CO2 Status */}
        <section>
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#E63946]" />
            Emissions Audit
          </h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Annual CO2 (2024)</p>
              <p className="text-xl font-black text-white font-mono leading-none">{props.co2_annual_2024_Gt} Gt</p>
              <p className={`text-[10px] mt-2 font-bold ${props.co2_yoy_2024_pct > 0 ? 'text-[#E63946]' : 'text-[#52B788]'}`}>
                {props.co2_yoy_2024_pct > 0 ? '▲' : '▼'} {props.co2_yoy_2024_pct}% YoY
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Per Voyage</p>
              <p className="text-xl font-black text-white font-mono leading-none">{Math.round(props.co2_per_voyage_t / 1000)}k t</p>
            </div>
          </div>
          <div className="relative pt-2">
            <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase mb-1.5">
              <span>Current Flux</span>
              <span>IMO 30% Target</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E63946]" 
                style={{ width: '85%' }} // Manual representation
              />
            </div>
          </div>
        </section>

        {/* Section 2: Green Transition Status */}
        <section>
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#37A7B3]" />
            G2Z Transition
          </h4>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-bold text-white/30 uppercase mb-1">Stage</p>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                props.g2z_stage_numeric >= 4 ? 'bg-[#52B788]/20 text-[#52B788]' : 
                props.g2z_stage_numeric >= 2 ? 'bg-[#F4A261]/20 text-[#F4A261]' : 'bg-[#E63946]/20 text-[#E63946]'
              }`}>
                {props.g2z_stage}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-white/30 uppercase mb-1">CII Grade</p>
              <span className={`h-8 w-8 flex items-center justify-center rounded-lg text-lg font-black ${
                props.cii_grade_2023 === 'A' ? 'bg-[#52B788] text-[#0d1117]' :
                props.cii_grade_2023 === 'B' ? 'bg-[#37A7B3] text-[#0d1117]' :
                props.cii_grade_2023 === 'C' ? 'bg-[#F97316] text-[#0d1117]' : 'bg-[#E63946] text-[#ffffff]'
              }`}>
                {props.cii_grade_2023}
              </span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
            <div className="text-[32px] font-black text-white font-mono leading-none mb-1">
              {props.g2z_composite_score}%
            </div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Readiness Score</p>
          </div>
        </section>

        {/* Section 3: Fuel Scenarios */}
        <section>
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#F97316]" />
            Future Fuel Pathways
          </h4>
          <div className="flex flex-col gap-4">
            {Object.entries(FUEL_SCENARIOS).map(([name, data]) => {
              const saved = Math.round(props.co2_annual_2024_Gt * data.reduction * 100) / 100;
              return (
                <div key={name} className="group flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <p className="text-[11px] font-bold text-white group-hover:text-[#37A7B3] transition-colors">{name}</p>
                    <p className="text-[10px] font-bold text-white/40">-{data.reduction*100}%</p>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ width: `${data.reduction * 100}%`, backgroundColor: data.color }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase">
                    <span>{data.status}</span>
                    <span>Saved: {saved} Mt CO2</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
