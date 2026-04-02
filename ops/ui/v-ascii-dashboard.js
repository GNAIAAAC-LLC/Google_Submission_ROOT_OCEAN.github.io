// ops/ui/v-ascii-dashboard.js
// Unified ASCII (SSCII) Dashboard
// Read-only, no-touch status panel for CORE + COE + Sleeping Agent + Ocean.
// Works on any OS with Node + a terminal.
//
// Run with:
//   node ops/ui/v-ascii-dashboard.js

const core = require("../../core/v-core-engine");
const coe = require("../mesh/v-continuous-operation-engine");
const agent = require("../mesh/v-sleeping-agent");
const ocean = require("../mesh/v-global-economy-master-ocean");

function line(len = 60, ch = "-") {
  return ch.repeat(len);
}

function center(text, width = 60) {
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(pad) + text;
}

function renderOnce() {
  const now = new Date().toISOString();

  const coreInfo = core.tick({ mode: "info" });
  const coeSleep = coe.tick({ mode: "sleep" });
  const auto = core.tick({ mode: "auto" });
  const oceanO1 = ocean.tick({ domain: "ocean", oceanPresetId: "O1" });
  const agentSleep = agent.stopAndSleep(); // ensure safe sleep state

  console.clear();
  console.log(line());
  console.log(center("GLOBAL AI BLACK BOX — ASCII CONTROL PANEL"));
  console.log(center(now));
  console.log(line());

  // CORE
  console.log("[CORE]");
  console.log(" Project:", coreInfo.output.config.projectName);
  console.log(" Version:", coreInfo.output.config.version);
  console.log(line());

  // COE
  console.log("[COE (Continuous Operation Engine)]");
  console.log(" Status:", coeSleep.output.health.status);
  console.log(" Note  :", coeSleep.output.health.note);
  console.log(line());

  // AUTO MODE SUMMARY
  console.log("[AUTO MODE]");
  console.log(" Best Preset:", auto.output.bestPreset.preset);
  console.log(" Score      :", auto.output.bestPreset.score.toFixed(3));
  console.log(line());

  // OCEAN O1 WELLBEING (if available)
  let wb = null;
  if (oceanO1.output.result && oceanO1.output.result.wellbeing) {
    wb = oceanO1.output.result.wellbeing;
  } else if (
    oceanO1.output.result &&
    oceanO1.output.result.scenario &&
    oceanO1.output.result.scenario.wellbeing
  ) {
    wb = oceanO1.output.result.scenario.wellbeing;
  }

  if (wb) {
    console.log("[OCEAN O1 — WELLBEING]");
    console.log(" Climate Risk        :", wb.climateRisk.toFixed(2));
    console.log(" Water Stress        :", wb.waterStress.toFixed(2));
    console.log(" Health Stress       :", wb.healthStress.toFixed(2));
    console.log(" Infra Fragility     :", wb.infraFragility.toFixed(2));
    console.log(" Community Resilience:", wb.communityResilience.toFixed(2));
    console.log(" Wellbeing Score     :", wb.wellbeingScore.toFixed(3));
    console.log(line());
  }

  // AGENT
  console.log("[SLEEPING AGENT]");
  console.log(" Mode :", agentSleep.state.mode);
  console.log(" Note :", agentSleep.note);
  console.log(line());
  console.log("Read-only panel. Automation is handled by COE + GitHub Actions.");
  console.log("You don't need to touch anything for the system to keep running.");
}

// Refresh every 5 seconds
renderOnce();
setInterval(renderOnce, 5000);
