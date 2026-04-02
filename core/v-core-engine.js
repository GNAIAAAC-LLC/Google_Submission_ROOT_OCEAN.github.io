// core/v-core-engine.js
// CORE: One combined root for config, dependencies, orchestration.
// This is the single "brain stem" of the project.
//
// It does NOT try to be a giant monolith of logic.
// Instead, it:
//  - Knows where everything lives
//  - Provides one unified tick()
//  - Applies simple "logical ML" filters (no-code style)
//  - Ensures outputs are stable, positive, and dashboard-ready.

const path = require("path");

// Engines & layers
const master = require("../ops/mesh/v-master-root-engine");
const ocean = require("../ops/mesh/v-global-economy-master-ocean");
const dashboard = require("../ops/mesh/v-dashboard-adapter");
const coe = require("../ops/mesh/v-continuous-operation-engine");

// -------------------------------------------------------------------
// CORE CONFIG
// -------------------------------------------------------------------

const CORE_CONFIG = {
  version: "1.0.0",
  projectName: "Global AI Black Box",
  rootDir: path.join(__dirname, ".."),
  dataDir: path.join(__dirname, "..", "public", "data"),
  defaultOceanPreset: "O1"
};

// -------------------------------------------------------------------
// SIMPLE "ML-LIKE" LOGIC (NO-CODE STYLE)
// -------------------------------------------------------------------

// Ensures numeric outputs are non-negative where appropriate.
function positivityFilter(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return value;
  return value < 0 ? 0 : value;
}

// Applies positivity filter to all numeric leaf values in an object.
function normalizePositive(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "number") return positivityFilter(obj);
  if (Array.isArray(obj)) return obj.map(normalizePositive);
  if (typeof obj === "object") {
    const out = {};
    for (const k of Object.keys(obj)) {
      out[k] = normalizePositive(obj[k]);
    }
    return out;
  }
  return obj;
}

// Simple "logical ML" decision: choose best ocean preset by wellbeing score.
function chooseBestOceanPreset() {
  const presets = ["O1", "O2", "O3"];
  let best = null;

  for (const p of presets) {
    const res = ocean.tick({ domain: "ocean", oceanPresetId: p });
    if (res.status !== "OK" || !res.output || !res.output.result) continue;

    const payload = res.output.result;
    let wb = null;

    if (payload.wellbeing) wb = payload.wellbeing;
    if (payload.scenario && payload.scenario.wellbeing) wb = payload.scenario.wellbeing;

    if (!wb || typeof wb.wellbeingScore !== "number") continue;

    if (!best || wb.wellbeingScore > best.score) {
      best = { preset: p, score: wb.wellbeingScore };
    }
  }

  return best || { preset: CORE_CONFIG.defaultOceanPreset, score: 0 };
}

// -------------------------------------------------------------------
// CORE TICK
// -------------------------------------------------------------------
//
// mode:
//  - "info"        → return config
//  - "ocean"       → run ocean preset + normalize
//  - "coe"         → run COE (daily/trigger/sleep)
//  - "dashboard"   → build dashboard cards
//  - "auto"        → choose best ocean preset, build dashboard, normalize
//

function tick(globalState = {}) {
  const {
    mode = "info",
    oceanPresetId,
    coeMode = "daily"
  } = globalState;

  try {
    let output;

    switch (mode) {
      case "info": {
        output = {
          status: "OK",
          note: "CORE info",
          config: CORE_CONFIG
        };
        break;
      }

      case "ocean": {
        const preset = oceanPresetId || CORE_CONFIG.defaultOceanPreset;
        const res = ocean.tick({ domain: "ocean", oceanPresetId: preset });
        output = {
          status: res.status,
          note: `Ocean preset ${preset}`,
          raw: res,
          normalized: normalizePositive(res)
        };
        break;
      }

      case "coe": {
        const res = coe.tick({ mode: coeMode });
        output = {
          status: res.status,
          note: `COE mode ${coeMode}`,
          raw: res,
          normalized: normalizePositive(res)
        };
        break;
      }

      case "dashboard": {
        const preset = oceanPresetId || CORE_CONFIG.defaultOceanPreset;
        const cards = dashboard.buildOceanCards(preset);
        output = {
          status: cards.status,
          note: `Dashboard cards for ${preset}`,
          raw: cards,
          normalized: normalizePositive(cards)
        };
        break;
      }

      case "auto": {
        // 1) Choose best ocean preset by wellbeing
        const best = chooseBestOceanPreset();

        // 2) Build dashboard for that preset
        const cards = dashboard.buildOceanCards(best.preset);

        // 3) Run a COE daily cycle
        const coeRes = coe.tick({ mode: "daily" });

        output = {
          status: "OK",
          note: "AUTO mode: best preset + dashboard + COE daily",
          bestPreset: best,
          dashboard: normalizePositive(cards),
          coe: normalizePositive(coeRes)
        };
        break;
      }

      default: {
        output = {
          status: "OK",
          note: "Unknown mode. Use info, ocean, coe, dashboard, or auto.",
          config: CORE_CONFIG
        };
      }
    }

    return {
      status: "OK",
      note: `CORE executed in mode: ${mode}`,
      output
    };
  } catch (e) {
    return {
      status: "ERROR",
      note: e.message
    };
  }
}

// -------------------------------------------------------------------
// EXPORTS
// -------------------------------------------------------------------

module.exports = {
  tick,
  CORE_CONFIG,
  normalizePositive,
  chooseBestOceanPreset
};
