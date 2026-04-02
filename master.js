// master.js
// The ONE terminal controller for the entire system.
// You run everything from here.
// Example:
//   node master agent awake
//   node master coe daily
//   node master core auto
//   node master ocean O1
//   node master sleep
//   node master dream

const core = require("./core/v-core-engine");
const coe = require("./ops/mesh/v-continuous-operation-engine");
const agent = require("./ops/mesh/v-sleeping-agent");
const ocean = require("./ops/mesh/v-global-economy-master-ocean");

// Read terminal args
const args = process.argv.slice(2);
const main = args[0] || "help";
const sub = args[1] || null;

function run() {
  switch (main) {
    // ---------------------------------------------------------
    // TINY AI SLEEPING AGENT
    // ---------------------------------------------------------
    case "agent":
      if (sub === "awake") return console.log(JSON.stringify(agent.playOnceAwake(), null, 2));
      if (sub === "dream") return console.log(JSON.stringify(agent.playOnceDream(), null, 2));
      if (sub === "sleep") return console.log(JSON.stringify(agent.stopAndSleep(), null, 2));
      return console.log("Usage: node master agent [awake|dream|sleep]");

    // ---------------------------------------------------------
    // CORE ENGINE
    // ---------------------------------------------------------
    case "core":
      return console.log(JSON.stringify(core.tick({ mode: sub || "info" }), null, 2));

    // ---------------------------------------------------------
    // COE ENGINE
    // ---------------------------------------------------------
    case "coe":
      return console.log(JSON.stringify(coe.tick({ mode: sub || "daily" }), null, 2));

    // ---------------------------------------------------------
    // OCEAN ENGINE
    // ---------------------------------------------------------
    case "ocean":
      return console.log(JSON.stringify(ocean.tick({ domain: "ocean", oceanPresetId: sub || "O1" }), null, 2));

    // ---------------------------------------------------------
    // SHORTCUTS
    // ---------------------------------------------------------
    case "sleep":
      return console.log(JSON.stringify(agent.stopAndSleep(), null, 2));

    case "awake":
      return console.log(JSON.stringify(agent.playOnceAwake(), null, 2));

    case "dream":
      return console.log(JSON.stringify(agent.playOnceDream(), null, 2));

    // ---------------------------------------------------------
    // HELP
    // ---------------------------------------------------------
    default:
      console.log(`
MASTER TERMINAL COMMANDS
------------------------

Agent Controls:
  node master agent awake
  node master agent sleep
  node master agent dream

Shortcuts:
  node master awake
  node master sleep
  node master dream

Core Engine:
  node master core info
  node master core auto

COE Engine:
  node master coe daily
  node master coe trigger
  node master coe sleep

Ocean Engine:
  node master ocean O1
  node master ocean O2
  node master ocean O3
`);
  }
}

run();
