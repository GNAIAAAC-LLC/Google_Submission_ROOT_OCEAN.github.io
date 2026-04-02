// ops/mesh/v-finance-probability-root-engine.js
// Finance + Probability Root Engine
// Mirrors the combinatorics engine structure.
// Contains: probability, EV, variance, SD, FV, PV, ROR, discounting, and presets.

function probability(eventCount, totalCount) {
  if (totalCount <= 0 || eventCount < 0 || eventCount > totalCount) {
    throw new Error("Invalid probability inputs.");
  }
  return eventCount / totalCount;
}

// Expected Value: Σ p_i * x_i
function expectedValue(values = [], probs = []) {
  if (values.length !== probs.length) {
    throw new Error("Values and probabilities must match in length.");
  }
  let ev = 0;
  for (let i = 0; i < values.length; i++) {
    ev += values[i] * probs[i];
  }
  return ev;
}

// Variance: Σ p_i * (x_i - EV)^2
function variance(values = [], probs = []) {
  const ev = expectedValue(values, probs);
  let v = 0;
  for (let i = 0; i < values.length; i++) {
    v += probs[i] * Math.pow(values[i] - ev, 2);
  }
  return v;
}

function stdDev(values = [], probs = []) {
  return Math.sqrt(variance(values, probs));
}

// Present Value: PV = FV / (1+r)^n
function PV(FV, r, n) {
  return FV / Math.pow(1 + r, n);
}

// Future Value: FV = PV * (1+r)^n
function FV(PV, r, n) {
  return PV * Math.pow(1 + r, n);
}

// Rate of Return: ROR = (FV/PV)^(1/n) - 1
function ROR(PV, FV, n) {
  return Math.pow(FV / PV, 1 / n) - 1;
}

// Discount Factor: DF = 1 / (1+r)^n
function discountFactor(r, n) {
  return 1 / Math.pow(1 + r, n);
}

// Risk-adjusted return: R_adj = r - ρ_risk
function riskAdjustedReturn(r, rho_risk) {
  return r - rho_risk;
}

// Machine-analysis presets
function runPreset(id) {
  switch (id) {
    case "P1":
      return {
        question: "Probability of 3 successes in 10 trials (simple ratio)",
        answer: probability(3, 10)
      };

    case "P2":
      return {
        question: "Expected value of {10, 20, 30} with probs {0.2, 0.5, 0.3}",
        answer: expectedValue([10, 20, 30], [0.2, 0.5, 0.3])
      };

    case "P3":
      return {
        question: "Variance of {2, 4, 6} with probs {0.3, 0.4, 0.3}",
        answer: variance([2, 4, 6], [0.3, 0.4, 0.3])
      };

    case "F1":
      return {
        question: "FV of PV=1000 at r=5% for 10 years",
        answer: FV(1000, 0.05, 10)
      };

    case "F2":
      return {
        question: "PV of FV=5000 at r=7% for 8 years",
        answer: PV(5000, 0.07, 8)
      };

    case "F3":
      return {
        question: "ROR from PV=2000 to FV=3500 in 5 years",
        answer: ROR(2000, 3500, 5)
      };

    default:
      return { message: "Unknown preset. Use P1–P3 or F1–F3." };
  }
}

// Root engine interface
function tick(globalState = {}) {
  const {
    mode = "info",
    eventCount,
    totalCount,
    values,
    probs,
    PV_value,
    FV_value,
    r,
    n,
    rho_risk,
    presetId
  } = globalState;

  try {
    let result;

    switch (mode) {
      case "probability":
        result = probability(eventCount, totalCount);
        break;

      case "expectedValue":
        result = expectedValue(values, probs);
        break;

      case "variance":
        result = variance(values, probs);
        break;

      case "stdDev":
        result = stdDev(values, probs);
        break;

      case "PV":
        result = PV(FV_value, r, n);
        break;

      case "FV":
        result = FV(PV_value, r, n);
        break;

      case "ROR":
        result = ROR(PV_value, FV_value, n);
        break;

      case "discountFactor":
        result = discountFactor(r, n);
        break;

      case "riskAdjustedReturn":
        result = riskAdjustedReturn(r, rho_risk);
        break;

      case "preset":
        result = runPreset(presetId);
        break;

      default:
        result = {
          message:
            "Finance/Probability root engine ready. Modes: probability, expectedValue, variance, stdDev, PV, FV, ROR, discountFactor, riskAdjustedReturn, preset."
        };
    }

    return {
      status: "OK",
      note: `Finance/Probability root engine executed in mode: ${mode}`,
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
  probability,
  expectedValue,
  variance,
  stdDev,
  PV,
  FV,
  ROR,
  discountFactor,
  riskAdjustedReturn
};
