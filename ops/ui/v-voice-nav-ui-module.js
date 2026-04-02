// ops/ui/v-voice-nav-ui-module.js
// Voice Navigation + UI Orchestrator (with face-gate stub)
// - Parses voice commands into navigation intents
// - Generates ASCII UI panels in sync with system state
// - Provides a FACE GATE STUB (no real biometrics here; plug in your own SDK)

// You can wire this to:
//  - speech-to-text (voice → text)
//  - a face-recognition SDK (token → verified user)
//  - your existing CORE / engines / maps

// -------------------------------------------------------------------
// VOICE COMMAND PARSER
// -------------------------------------------------------------------

function parseVoiceCommand(text = "") {
  const t = text.toLowerCase().trim();

  // Very simple intent extraction
  if (!t) {
    return { intent: "none", raw: text };
  }

  // Destination intents
  if (t.includes("beach")) {
    return { intent: "navigate", destination: "beach", raw: text };
  }
  if (t.includes("stadium")) {
    return { intent: "navigate", destination: "stadium", raw: text };
  }
  if (t.includes("city center") || t.includes("downtown")) {
    return { intent: "navigate", destination: "city_center", raw: text };
  }

  // Status / system intents
  if (t.includes("status") || t.includes("dashboard")) {
    return { intent: "show_status", raw: text };
  }
  if (t.includes("sleep")) {
    return { intent: "agent_sleep", raw: text };
  }
  if (t.includes("awake") || t.includes("wake")) {
    return { intent: "agent_awake", raw: text };
  }
  if (t.includes("dream") || t.includes("auto")) {
    return { intent: "agent_dream", raw: text };
  }

  // Fallback
  return { intent: "unknown", raw: text };
}

// -------------------------------------------------------------------
// FACE GATE STUB (NO REAL BIOMETRICS)
// -------------------------------------------------------------------
//
// In a real system, you would:
//  - Capture a face image or embedding
//  - Send it to a secure face-recognition service
//  - Receive a boolean or confidence score
//
// Here we just simulate a "session token" check.

function verifyFaceSession(sessionToken) {
  // Placeholder logic: treat any non-empty token as "verified"
  const verified = typeof sessionToken === "string" && sessionToken.trim().length > 0;

  return {
    verified,
    note: verified
      ? "Face session token accepted (stub). Plug in real face-recognition SDK here."
      : "No valid face session token. Access should be limited."
  };
}

// -------------------------------------------------------------------
// ASCII UI GENERATOR
// -------------------------------------------------------------------
//
// This generates a unified ASCII panel based on:
//  - user identity (via face gate stub)
//  - last voice command
//  - navigation target
//  - system mode

function generateAsciiUI({
  userName = "Guest",
  faceSessionToken = "",
  lastVoiceText = "",
  navTarget = null,        // "beach" | "stadium" | "city_center" | null
  systemMode = "sleep"     // "sleep" | "awake" | "dream"
} = {}) {
  const face = verifyFaceSession(faceSessionToken);
  const voice = parseVoiceCommand(lastVoiceText);

  const lines = [];
  const line = (len = 60, ch = "-") => ch.repeat(len);
  const center = (text, width = 60) => {
    const pad = Math.max(0, Math.floor((width - text.length) / 2));
    return " ".repeat(pad) + text;
  };

  lines.push(line());
  lines.push(center("GLOBAL NAV + UI — ASCII PANEL"));
  lines.push(line());
  lines.push(`[USER]`);
  lines.push(` Name     : ${userName}`);
  lines.push(` Verified : ${face.verified ? "YES" : "NO"} (${face.note})`);
  lines.push(line());
  lines.push(`[VOICE]`);
  lines.push(` Last Command : "${lastVoiceText || "-"}"`);
  lines.push(` Parsed Intent: ${voice.intent}`);
  if (voice.destination) {
    lines.push(` Destination  : ${voice.destination}`);
  }
  lines.push(line());
  lines.push(`[SYSTEM MODE]`);
  lines.push(` Mode : ${systemMode}`);
  lines.push(line());
  lines.push(`[NAVIGATION TARGET]`);

  let navDescription = "None";

  switch (navTarget || voice.destination) {
    case "beach":
      navDescription = "San Francisco — Crissy Field Beach (north) or Baker Beach (northwest).";
      break;
    case "stadium":
      navDescription = "San Francisco — Oracle Park / Chase Center (south of city center).";
      break;
    case "city_center":
      navDescription = "San Francisco — Union Square / Market Street (downtown).";
      break;
  }

  lines.push(` Target : ${navDescription}`);
  lines.push(line());
  lines.push("This panel is read-only. Voice + face gate drive what you see,");
  lines.push("but automation and control logic live in your CORE / COE / engines.");
  lines.push(line());

  return lines.join("\n");
}

// -------------------------------------------------------------------
// EXPORTS
// -------------------------------------------------------------------

module.exports = {
  parseVoiceCommand,
  verifyFaceSession,
  generateAsciiUI
};
