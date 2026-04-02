// ops/mesh/v-continuous-operation-engine.js
// Master COE (Continuous Operation Engine)
// Keeps the whole system alive, monitored, refreshed, and ready:
// - Master V Engine
// - Global Economy Master Ocean
// - Dashboard Adapter
// - Website JSON feeds (for GitHub Pages or any static host)

const fs = require("fs");
const path = require("path");

const master = require("./v-master-root-engine");
const ocean = require("./v-global-economy-master-ocean");
const dashboard = require("./v-dashboard-adapter");

// --- CONFIG ---------------------------------------------------------

const COE_CONFIG = {
  // Where to write dashboard JSON for the website to consume
  outputDir: path.join(__dirname, "..", "..", "public", "data"),
  oceanPresets: ["O1", "O2", "O3"],
  // Simple health thresholds (can be extended)
  maxErrorCount: 10
};

// --- UTILITIES ------------------------------------------------------

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJSON(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

// --- HEALTH CHECKS --------------------------------------------------

// Very simple placeholder health check; extend as needed.
function runHealthCheck() {
  // Example: ping master engine in info mode
  const res = master.tick({ domain: "info" });

  const ok = res.status === "OK";
  return {
    status: ok ? "OK" : "WARN",
    note: res.note || "Master engine ping",
    timestamp: new Date().toISOString()
  };
}

// --- DASHBOARD REFRESH ----------------------------------------------

function refreshOceanDashboards() {
  const results = {};

  for (const preset of COE_CONFIG.oceanPresets) {
    const cards = dashboard.buildOceanCards(preset);
    results[preset] = cards;
  }

  const outFile = path.join(COE_CONFIG.outputDir, "ocean-dashboard.json");
  writeJSON(outFile, {
    generatedAt: new Date().toISOString(),
    presets: results
  });

  return {
    status: "OK",
    note: "Ocean dashboards refreshed",
    file: outFile
  };
}

// Example: generic engine output dump (for debugging / advanced UI)
function refreshEngineSnapshot() {
  const samples = {
    combinatorics_Q1: master.combinatorics.tick({ mode: "preset", presetId: "Q1" }),
    finance_F1: master.financeProb.tick({ mode: "preset", presetId: "F1" }),
    ocean_O1: ocean.tick({ domain: "ocean", oceanPresetId: "O1" })
  };

  const outFile = path.join(COE_CONFIG.outputDir, "engine-snapshot.json");
  writeJSON(outFile, {
    generatedAt: new Date().toISOString(),
    samples
  });

  return {
    status: "OK",
    note: "Engine snapshot refreshed",
    file: outFile
  };
}

// --- MAIN CYCLES ----------------------------------------------------

// Daily / scheduled cycle: scan → analyze → refresh → publish
function runDailyCycle() {
  const health = runHealthCheck();
  const dashboards = refreshOceanDashboards();
  const snapshot = refreshEngineSnapshot();

  return {
    status: "OK",
    note: "Daily COE cycle completed",
    health,
    dashboards,
    snapshot,
    timestamp: new Date().toISOString()
  };
}

// Trigger-based cycle: called when something important changes
function runTriggerCycle(trigger = "manual") {
  const health = runHealthCheck();
  const dashboards = refreshOceanDashboards();

  return {
    status: "OK",
    note: `Trigger COE cycle executed (${trigger})`,
    health,
    dashboards,
    timestamp: new Date().toISOString()
  };
}

// Lightweight “sleep” check: minimal ping
function runSleepCheck() {
  const health = runHealthCheck();
  return {
    status: "OK",
    note: "Sleep check",
    health
  };
}

// --- PUBLIC INTERFACE -----------------------------------------------

function tick(globalState = {}) {
  const {
    mode = "info" // "daily" | "trigger" | "sleep" | "info"
  } = globalState;

  try {
    let result;

    switch (mode) {
      case "daily":
        result = runDailyCycle();
        break;
      case "trigger":
        result = runTriggerCycle(globalState.trigger || "manual");
        break;
      case "sleep":
        result = runSleepCheck();
        break;
      default:
        result = {
          status: "OK",
          note: "COE ready. Modes: daily, trigger, sleep.",
          config: COE_CONFIG
        };
    }

    return {
      status: "OK",
      note: `COE executed in mode: ${mode}`,
      output: result
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
  runDailyCycle,
  runTriggerCycle,
  runSleepCheck
};
