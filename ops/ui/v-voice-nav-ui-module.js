// ops/ui/v-voice-nav-ui-module.js
// Voice navigation + ASCII UI + face-session stub

function parseVoiceCommand(text = "") {
  const t = text.toLowerCase().trim();

  if (!t) return { intent: "none", raw: text };

  if (t.includes("beach")) return { intent: "navigate", destination: "beach", raw: text };
  if (t.includes("stadium")) return { intent: "navigate", destination: "stadium", raw: text };
  if (t.includes("city center") || t.includes("downtown"))
    return { intent: "navigate", destination: "city_center", raw: text };

  if (t.includes("status")) return { intent: "show_status", raw: text };
  if (t.includes("sleep")) return { intent: "agent_sleep", raw: text };
  if (t.includes("awake")) return { intent: "agent_awake", raw: text };
  if (t.includes("dream") || t.includes("auto")) return { intent: "agent_dream", raw: text };

  return { intent: "unknown", raw: text };
}

function verifyFaceSession(token = "") {
  const verified = typeof token === "string" && token.trim().length > 0;
  return {
    verified,
    note: verified
      ? "Face session accepted (stub). Replace with real SDK."
      : "Invalid face session token."
  };
}

function generateAsciiUI({
  userName = "Guest",
  faceSessionToken = "",
  lastVoiceText = "",
  navTarget = null,
  systemMode = "sleep"
} = {}) {
  const face = verifyFaceSession(faceSessionToken);
  const voice = parseVoiceCommand(lastVoiceText);

  const line = (n = 60, ch = "-") => ch.repeat(n);
  const center = (txt, w = 60) => " ".repeat(Math.max(0, (w - txt.length) / 2)) + txt;

  let navDescription = "None";
  switch (navTarget || voice.destination) {
    case "beach":
      navDescription = "Crissy Field Beach / Baker Beach (San Francisco)";
      break;
    case "stadium":
      navDescription = "Oracle Park / Chase Center (San Francisco)";
      break;
    case "city_center":
      navDescription = "Union Square / Market Street (San Francisco)";
      break;
  }

  return [
    line(),
    center("VOICE NAV + ASCII UI PANEL"),
    line(),
    `[USER]`,
    ` Name     : ${userName}`,
    ` Verified : ${face.verified}`,
    ` Note     : ${face.note}`,
    line(),
    `[VOICE]`,
    ` Command  : "${lastVoiceText}"`,
    ` Intent   : ${voice.intent}`,
    ` Target   : ${voice.destination || "None"}`,
    line(),
    `[SYSTEM MODE]`,
    ` Mode     : ${systemMode}`,
    line(),
    `[NAVIGATION]`,
    ` Destination : ${navDescription}`,
    line(),
    "End of panel."
  ].join("\n");
}

module.exports = {
  parseVoiceCommand,
  verifyFaceSession,
  generateAsciiUI
};
