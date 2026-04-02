// core/core-run.js
// Command-line runner for the Tiny AI Sleeping Agent + CORE + COE.
// This is the file you run with:
//   node core-run.js agent awake
//   node core-run.js agent sleep
//   node core-run.js agent dream
//   node core-run.js core auto
//   node core-run.js coe daily

const sleepingAgent = require("../ops/mesh/v-sleeping-agent");
const core = require("./v-core-engine");
const coe = require("../ops/mesh/v-continuous-operation-engine");

// Read CLI arguments
const args = process.argv.slice(2);
const mainCommand = args[0] || "info";
const subCommand = args[1] || null;

function run() {
  switch (mainCommand) {
    // ---------------------------------------------------------
    // TINY AI SLEEPING AGENT COMMANDS
    // ---------------------------------------------------------
    case "agent":
      if (subCommand === "awake") {
        console.log(JSON.stringify(sleepingAgent.playOnceAwake(), null, 2));
      } else if (subCommand === "dream") {
        console.log(JSON.stringify(sleepingAgent.playOnceDream(), null, 2));
      } else if (subCommand === "sleep") {
        console.log(JSON.stringify(sleepingAgent.stopAndSleep(), null, 2));
      } else {
        console.log("Usage: node core-run.js agent [awake|dream|sleep]");
      }
      break;

    // ---------------------------------------------------------
    // CORE ENGINE COMMANDS
    // ---------------------------------------------------------
    case "core":
      console.log(JSON.stringify(core.tick({ mode: subCommand || "info" }), null, 2));
      break;

    // ---------------------------------------------------------
    // COE (Continuous Operation Engine)
    // ---------------------------------------------------------
    case "coe":
      console.log(JSON.stringify(coe.tick({ mode: subCommand || "daily" }), null, 2));
      break;

    // ---------------------------------------------------------
    // DEFAULT
    // ---------------------------------------------------------
    default:
      console.log("Commands:");
      console.log("  node core-run.js agent awake");
      console.log("  node core-run.js agent sleep");
      console.log("  node core-run.js agent dream");
      console.log("  node core-run.js core auto");
      console.log("  node core-run.js coe daily");
      break;
  }
}

run();
