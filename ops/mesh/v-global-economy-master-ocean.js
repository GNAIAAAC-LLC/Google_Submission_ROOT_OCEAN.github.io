// ops/mesh/v-global-economy-master-ocean.js
// One single Master Root Ocean
// Human–AI global economy + climate crisis + ecosystem + communities.
// Connects: master root engine (combinatorics + finance/probability) into
// climate, economy, and community wellbeing routes.

const master = require("./v-master-root-engine");

// --- Helper: clamp and safe defaults ---
function safeNumber(x, def = 0) {
  return typeof x === "number" && !Number.isNaN(x) ? x : def;
}

// --- Climate-Economy-Community Metrics Layer ---

// Simple planetary wellbeing score (0–1) from sub-metrics
function planetaryWellbeing({
  climateRisk = 0.5,      // 0 (safe) → 1 (critical)
  waterStress = 0.5,
  healthStress = 0.5,
  infraFragility = 0.5,
  communityResilience = 0.5 // 0 (weak) → 1 (strong)
}) {
  climateRisk = safeNumber(climateRisk, 0.5);
  waterStress = safeNumber(waterStress, 0.5);
  healthStress = safeNumber(healthStress, 0.5);
  infraFragility = safeNumber(infraFragility, 0.5);
  communityResilience = safeNumber(communityResilience, 0.5);

  // Risk side (higher is worse)
  const avgRisk = (climateRisk + waterStress + healthStress + infraFragility) / 4;
  // Resilience side (higher is better)
  const R = communityResilience;

  // Wellbeing score: resilience vs risk
  const score = Math.max(0, Math.min(1, R * (1 - avgRisk)));

  return {
    climateRisk,
    waterStress,
    healthStress,
    infraFragility,
    communityResilience,
    wellbeingScore: score
  };
}

// Global green investment FE model
// Uses combinatorics FE + finance PV/FV/ROR to estimate:
// - Future earnings of green transition
// - Discounted present value
// - Implied rate of return
function greenTransitionEconomy({
  basePV = 1_000_000,   // initial investment
  i_m = 0.02,           // market growth
  i_g = 0.03,           // green growth uplift
  alpha = 0.01,         // innovation / tech alpha
  pi_inf = 0.02,        // inflation
  rho_risk = 0.01,      // risk premium
  years = 20,
  discountRate = 0.04
}) {
  // Step 1: future earnings via combinatorics FE engine (through master)
  const feResult = master.combinatorics.futureEarnings({
    PV: basePV,
    i_m,
    i_g,
    alpha,
    pi_inf,
    rho_risk,
    n: years
  });

  const FE = feResult.FE;
  const realFactor = feResult.realFactor;

  // Step 2: discount FE back to PV via finance engine
  const PV_again = master.financeProb.PV(FE, discountRate, years);

  // Step 3: implied rate of return from basePV to FE
  const impliedROR = master.financeProb.ROR(basePV, FE, years);

  return {
    basePV,
    years,
    FE,
    realFactor,
    discountedPV: PV_again,
    impliedROR
  };
}

// Community-level climate–economy scenario
// Combines probability, EV, and wellbeing.
function communityScenario({
  outcomes = [ -0.1, 0.0, 0.05, 0.1 ],   // GDP change fractions
  probs = [ 0.2, 0.3, 0.3, 0.2 ],
  baseGDP = 100_000_000,
  climateRisk = 0.5,
  waterStress = 0.5,
  healthStress = 0.5,
  infraFragility = 0.5,
  communityResilience = 0.5
}) {
  const EV_fraction = master.financeProb.expectedValue(outcomes, probs);
  const EV_GDP = baseGDP * (1 + EV_fraction);

  const wellbeing = planetaryWellbeing({
    climateRisk,
    waterStress,
    healthStress,
    infraFragility,
    communityResilience
  });

  return {
    baseGDP,
    outcomes,
    probs,
    EV_fraction,
    EV_GDP,
    wellbeing
  };
}

// --- Master Ocean Presets ---
// These are narrative-aligned, climate–economy–community bundles.
function runOceanPreset(id) {
  switch (id) {
    case "O1": {
      // Global green transition scenario
      const econ = greenTransitionEconomy({});
      const wellbeing = planetaryWellbeing({
        climateRisk: 0.6,
        waterStress: 0.5,
        healthStress: 0.4,
        infraFragility: 0.4,
        communityResilience: 0.7
      });
      return {
        label: "O1: Global green transition",
        economy: econ,
        wellbeing
      };
    }

    case "O2": {
      // Community-level adaptation scenario
      const scenario = communityScenario({
        outcomes: [ -0.05, 0.0, 0.03, 0.08 ],
        probs: [ 0.25, 0.25, 0.3, 0.2 ],
        baseGDP: 50_000_000,
        climateRisk: 0.5,
        waterStress: 0.4,
        healthStress: 0.4,
        infraFragility: 0.3,
        communityResilience: 0.8
      });
      return {
        label: "O2: Community adaptation & resilience",
        scenario
      };
    }

    case "O3": {
      // High-risk climate scenario with strong green investment
      const econ = greenTransitionEconomy({
        basePV: 5_000_000,
        i_m: 0.015,
        i_g: 0.05,
        alpha: 0.02,
        pi_inf: 0.025,
        rho_risk: 0.02,
        years: 25,
        discountRate: 0.05
      });
      const wellbeing = planetaryWellbeing({
        climateRisk: 0.8,
        waterStress: 0.7,
        healthStress: 0.6,
        infraFragility: 0.6,
        communityResilience: 0.9
      });
      return {
        label: "O3: High-risk climate, strong green push",
        economy: econ,
        wellbeing
      };
    }

    default:
      return {
        message:
          "Unknown ocean preset. Use O1, O2, O3 or extend with your own climate–economy–community bundles."
      };
  }
}

// --- Master Ocean tick ---
// domain: "ocean" | "master" | "combinatorics" | "finance"
function tick(globalState = {}) {
  const {
    domain = "ocean",
    oceanPresetId,
    // pass-through for sub-engines
    ...rest
  } = globalState;

  try {
    let output;

    switch (domain) {
      case "ocean": {
        output = {
          status: "OK",
          note: `Global economy master ocean preset: ${oceanPresetId}`,
          result: runOceanPreset(oceanPresetId)
        };
        break;
      }

      case "master": {
        // delegate to v-master-root-engine
        output = master.tick(rest);
        break;
      }

      case "combinatorics": {
        output = master.combinatorics.tick(rest);
        break;
      }

      case "finance": {
        output = master.financeProb.tick(rest);
        break;
      }

      default: {
        output = {
          status: "OK",
          note: "Global economy master ocean ready.",
          result: {
            message:
              "Set domain to 'ocean', 'master', 'combinatorics', or 'finance'. For ocean, set oceanPresetId (O1, O2, O3)."
          }
        };
      }
    }

    return {
      status: "OK",
      note: `Global economy master ocean executed in domain: ${domain}`,
      output
    };
  } catch (e) {
    return {
      status: "ERROR",
      note: e.message
    };
  }
}

module.exports = {
  tick,
  planetaryWellbeing,
  greenTransitionEconomy,
  communityScenario,
  runOceanPreset
};
