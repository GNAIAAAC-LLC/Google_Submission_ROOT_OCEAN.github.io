// ops/mesh/v-master-root-engine.js
// Master V Engine of All Togetherness
// Orchestrates: combinatorics root engine + finance/probability root engine
// Single sovereign interface: one tick(), many domains.

const combinatorics = require("./v-combinatorics-root-engine");
const financeProb = require("./v-finance-probability-root-engine");

// Optional: global meta-presets that combine both worlds
function runMasterPreset(id) {
  switch (id) {
    case "MP1": {
      // Example: combinatorial scenario + expected value of payoff
      // Suppose number of ways = nCr(30,4), payoff per success = 100
      const ways = combinatorics.nCr(30, 4);
      const payoff = 100;
      const EV = ways * payoff;
      return {
        label: "MP1: Combinatorial count * fixed payoff",
        ways,
        payoff,
        expectedValue: EV
      };
    }

    case "MP2": {
      // Example: future earnings using FE + discounting to PV
      const FEres = combinatorics.futureEarnings({
        PV: 1000,
        i_m: 0.03,
        i_g: 0.02,
        alpha: 0.01,
        pi_inf: 0.02,
        rho_risk: 0.01,
        n: 10
      });
      const FE = FEres.FE;
      const PV_again = financeProb.PV(FE, 0.05, 10);
      return {
        label: "MP2: Future Earnings + PV via finance engine",
        FE,
        realFactor: FEres.realFactor,
        PV_again
      };
    }

    default:
      return { message: "Unknown master preset. Use MP1, MP2, or extend." };
  }
}

// Master tick
// Domains: "combinatorics", "finance", "master"
function tick(globalState = {}) {
  const {
    domain = "info",   // "combinatorics" | "finance" | "master"
    mode = "info",     // passed down to sub-engines
    masterPresetId,    // for domain = "master"
    // everything else is passed through
    ...rest
  } = globalState;

  try {
    let result;

    switch (domain) {
      case "combinatorics": {
        // Delegate to combinatorics root engine
        result = combinatorics.tick({ mode, ...rest });
        break;
      }

      case "finance": {
        // Delegate to finance/probability root engine
        result = financeProb.tick({ mode, ...rest });
        break;
      }

      case "master": {
        // Master-level presets that combine both
        result = {
          status: "OK",
          note: `Master preset executed: ${masterPresetId}`,
          output: runMasterPreset(masterPresetId)
        };
        break;
      }

      default: {
        result = {
          status: "OK",
          note: "Master V engine ready.",
          output: {
            message:
              "Set domain to 'combinatorics', 'finance', or 'master'. Then set mode (for sub-engines) or masterPresetId."
          }
        };
      }
    }

    return {
      status: "OK",
      note: `Master V engine executed in domain: ${domain}, mode: ${mode}`,
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
  // Expose sub-engines if you want direct access
  combinatorics,
  financeProb,
  runMasterPreset
};
