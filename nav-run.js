// nav-run.js
// Bash-friendly runner for voice navigation + ASCII UI

const ui = require("./ops/ui/v-voice-nav-ui-module");

const voice = process.argv[2] || "";
const token = process.argv[3] || "";
const mode = process.argv[4] || "sleep";

const panel = ui.generateAsciiUI({
  userName: process.env.USER_NAME || "Arifur",
  faceSessionToken: token,
  lastVoiceText: voice,
  systemMode: mode
});

console.log(panel);
