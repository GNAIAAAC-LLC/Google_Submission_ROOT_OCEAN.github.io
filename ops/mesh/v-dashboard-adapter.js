// ops/mesh/v-dashboard-adapter.js
// Dashboard Adapter for Global Economy Master Ocean
// Turns engine outputs into UI-ready cards/blocks for a web dashboard.

const ocean = require("./v-global-economy-master-ocean");

// Helper: safe label + number formatting
function fmtNumber(x, digits = 2) {
  if (typeof x !== "number" || Number.isNaN(x)) return null;
  return Number(x.toFixed(digits));
}

// Build cards from O1/O2/O3 style presets
function buildOceanCards(oceanPresetId = "O1") {
  const res = ocean.tick({ domain: "ocean", oceanPresetId });

  if (res.status !== "OK" || !res.output || !res.output.result) {
    return {
      status: "ERROR",
      note: res.note || "Ocean engine error",
      cards: []
    };
  }

  const payload = res.output.result;

  // Different shapes for different presets
  if (oceanPresetId === "O1" || oceanPresetId === "O3") {
    const econ = payload.economy;
    const wb = payload.wellbeing;

    return {
      status: "OK",
      note: payload.label,
      cards: [
        {
          id: "economy-summary",
          type: "metric-group",
          title: "Green Transition Economy",
          metrics: [
            { label: "Base PV", value: fmtNumber(econ.basePV, 0), unit: "currency" },
            { label: "Years", value: econ.years, unit: "years" },
            { label: "Future Earnings (FE)", value: fmtNumber(econ.FE, 0), unit: "currency" },
            { label: "Discounted PV", value: fmtNumber(econ.discountedPV, 0), unit: "currency" },
            { label: "Implied ROR", value: fmtNumber(econ.impliedROR * 100, 2), unit: "%" }
          ]
        },
        {
          id: "planetary-wellbeing",
          type: "metric-group",
          title: "Planetary Wellbeing",
          metrics: [
            { label: "Climate Risk", value: fmtNumber(wb.climateRisk, 2), unit: "index" },
            { label: "Water Stress", value: fmtNumber(wb.waterStress, 2), unit: "index" },
            { label: "Health Stress", value: fmtNumber(wb.healthStress, 2), unit: "index" },
            { label: "Infra Fragility", value: fmtNumber(wb.infraFragility, 2), unit: "index" },
            { label: "Community Resilience", value: fmtNumber(wb.communityResilience, 2), unit: "index" },
            { label: "Wellbeing Score", value: fmtNumber(wb.wellbeingScore, 2), unit: "index" }
          ]
        }
      ]
    };
  }

  if (oceanPresetId === "O2") {
    const sc = payload.scenario;
    const wb = sc.wellbeing;

    return {
      status: "OK",
      note: payload.label,
      cards: [
        {
          id: "community-economy",
          type: "metric-group",
          title: "Community Economy Scenario",
          metrics: [
            { label: "Base GDP", value: fmtNumber(sc.baseGDP, 0), unit: "currency" },
            { label: "EV Fraction", value: fmtNumber(sc.EV_fraction * 100, 2), unit: "%" },
            { label: "EV GDP", value: fmtNumber(sc.EV_GDP, 0), unit: "currency" }
          ]
        },
        {
          id: "community-wellbeing",
          type: "metric-group",
          title: "Community Wellbeing",
          metrics: [
            { label: "Climate Risk", value: fmtNumber(wb.climateRisk, 2), unit: "index" },
            { label: "Water Stress", value: fmtNumber(wb.waterStress, 2), unit: "index" },
            { label: "Health Stress", value: fmtNumber(wb.healthStress, 2), unit: "index" },
            { label: "Infra Fragility", value: fmtNumber(wb.infraFragility, 2), unit: "index" },
            { label: "Community Resilience", value: fmtNumber(wb.communityResilience, 2), unit: "index" },
            { label: "Wellbeing Score", value: fmtNumber(wb.wellbeingScore, 2), unit: "index" }
          ]
        }
      ]
    };
  }

  // Fallback
  return {
    status: "OK",
    note: "Unknown preset shape, raw payload returned.",
    cards: [],
    raw: payload
  };
}

// Generic adapter for any engine call (combinatorics/finance/master)
function buildEngineCard({ domain, mode, ...rest }) {
  const res = ocean.tick({ domain, mode, ...rest });

  return {
    status: res.status,
    note: res.note,
    card: {
      id: `engine-${domain}-${mode}`,
      type: "raw-output",
      title: `Engine: ${domain} / ${mode}`,
      payload: res.output
    }
  };
}

module.exports = {
  buildOceanCards,
  buildEngineCard
};
