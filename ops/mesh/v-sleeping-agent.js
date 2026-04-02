// ops/mesh/v-sleeping-agent.js
// Tiny AI Sleeping Agent
// Light wrapper around CORE + COE that only runs when you tell it to.
// No autonomy beyond what your commands allow.

const core = require("../../core/v-core-engine");
const coe = require("./v-continuous-operation-engine");

// Simple state holder (in-memory only)
let AGENT_STATE = {
  mode: "sleep",   // "sleep" | "awake" | "dream"
  lastRun: null
};

function setMode(mode) {
  if (!["sleep", "awake", "dream"].includes(mode)) {
    throw new Error("Invalid mode for sleeping agent.");
  }
  AGENT_STATE.mode = mode;
  return { status: "OK", mode };
}

function tick() {
  const now = new Date().toISOString();
  let result;

  switch (AGENT_STATE.mode) {
    case "sleep":
      // Minimal ping, nothing heavy
      result = coe.runSleepCheck();
      break;

    case "awake":
      // Light operational work: trigger cycle
      result = coe.runTriggerCycle("agent-awake");
      break;

    case "dream":
      // Use CORE auto mode: best preset + dashboard + COE daily
      result = core.tick({ mode: "auto" });
      break;

    default:
      result = { status: "OK", note: "Unknown mode, doing nothing." };
  }

  AGENT_STATE.lastRun = now;

  return {
    status: "OK",
    note: `Sleeping agent tick in mode: ${AGENT_STATE.mode}`,
    time: now,
    state: AGENT_STATE,
    result
  };
}

// Manual “play” commands – always under your control
function playOnceAwake() {
  setMode("awake");
  return tick();
}

function playOnceDream() {
  setMode("dream");
  return tick();
}

function stopAndSleep() {
  setMode("sleep");
  return {
    status: "OK",
    note: "Agent put to sleep by user command.",
    state: AGENT_STATE
  };
}

module.exports = {
  setMode,
  tick,
  playOnceAwake,
  playOnceDream,
  stopAndSleep
};
