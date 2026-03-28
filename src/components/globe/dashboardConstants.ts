// Pre-processed from external_insights/ CSVs for SpaceHack 2026
export const GLOBAL_STATS = {
  active_corridors_2025: 84,
  realization_stage: 6,
  thetis_total_co2_Mt: 531.7,
  thetis_ships_reporting: 28774,
  imo_2030_target_pct: 30,
  imo_2050_target: "Net-zero",
  countdown_target_year: 2050
};

export const FUEL_SCENARIOS = {
  "LNG + Wind-Assist": { 
    reduction: 0.35, 
    trl: 8, 
    cost_usd_t: 375, 
    status: "Commercial",
    color: "#E9C46A"
  },
  "Green Methanol": { 
    reduction: 0.75, 
    trl: 7, 
    cost_usd_t: 800, 
    status: "Early commercial",
    color: "#52B788"
  },
  "Green Ammonia": { 
    reduction: 0.92, 
    trl: 5, 
    cost_usd_t: 1100, 
    status: "Pilot/demo",
    color: "#2D6A4F"
  }
};
