import { aiHiringTools } from "@/data/tools"
import { regulatedStates } from "@/data/states"

export interface ToolAnalysisItem {
  toolId: string
  toolName: string
  category: string
  laws: string[]
  reason: string
}

export interface ToolAnalysisResult {
  totalTools: number
  high: ToolAnalysisItem[]   // 🔴 Immediate compliance action
  medium: ToolAnalysisItem[] // 🟡 AI features to be aware of
  low: ToolAnalysisItem[]    // 🟢 No current compliance requirements
}

// Tools that directly use AI for employment decisions — highest risk
const HIGH_RISK_TOOL_IDS = new Set([
  "linkedin-recruiter", "hirevue", "pymetrics", "eightfold",
  "greenhouse", "lever", "workday", "textio", "paradox-olivia",
  "spark-hire", "criteria", "checkr",
])

// Tools with AI features that could affect employment decisions
const MEDIUM_RISK_TOOL_IDS = new Set([
  "indeed", "ziprecruiter", "dice", "copilot", "chatgpt", "claude", "gemini",
  "microsoft-teams", "zoom", "bamboohr", "rippling", "adp",
  "pave", "salary-com", "payscale",
  "hubstaff", "time-doctor", "activtrak",
])

// State-specific laws mapping
const STATE_LAWS: Record<string, { name: string; shortName: string }[]> = {
  IL: [{ name: "Illinois AI Video Interview Act (820 ILCS 42)", shortName: "IL AIVI Act" }],
  CO: [{ name: "Colorado AI Act (SB 21-169)", shortName: "CO AI Act" }],
  NY: [{ name: "NYC Local Law 144 (AEDT)", shortName: "NYC LL144" }],
  CA: [{ name: "California CCPA/CPRA AI Provisions", shortName: "CA CCPA" }],
  MD: [{ name: "Maryland HB 1202 (Facial Recognition)", shortName: "MD HB1202" }],
  TX: [{ name: "Texas CUBI Act (Biometric Data)", shortName: "TX CUBI" }],
  NJ: [{ name: "New Jersey AEDT Legislation", shortName: "NJ AEDT" }],
  DC: [{ name: "DC Stop Discrimination by Algorithms Act", shortName: "DC SDAA" }],
  CT: [{ name: "Connecticut AI Bill (SB 1103)", shortName: "CT AI Bill" }],
  VT: [{ name: "Vermont AI Transparency Act", shortName: "VT AI Act" }],
}

// Monitoring tools trigger additional state privacy laws
const MONITORING_PRIVACY_LAWS: Record<string, string> = {
  CT: "CT Employee Monitoring Act",
  DE: "DE Employee Monitoring Law",
  NY: "NY Electronic Monitoring Act (§52-c)",
  CA: "CA Privacy Rights (CCPA/CPRA)",
  CO: "CO Privacy Act",
}

export function analyzeToolStack(toolIds: string[], states: string[]): ToolAnalysisResult {
  const selectedTools = toolIds
    .map(id => aiHiringTools.find(t => t.id === id))
    .filter(Boolean) as typeof aiHiringTools

  const hasRegulatedStates = states.some(s => regulatedStates.includes(s))
  const applicableLaws = states.flatMap(s => STATE_LAWS[s] || [])

  const high: ToolAnalysisItem[] = []
  const medium: ToolAnalysisItem[] = []
  const low: ToolAnalysisItem[] = []

  for (const tool of selectedTools) {
    if (tool.id === "other") continue

    if (HIGH_RISK_TOOL_IDS.has(tool.id) && hasRegulatedStates) {
      high.push({
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        laws: applicableLaws.map(l => l.shortName),
        reason: `Uses AI for employment decisions in regulated state(s)`,
      })
    } else if (MEDIUM_RISK_TOOL_IDS.has(tool.id)) {
      const laws: string[] = []
      // Monitoring tools get extra privacy laws
      if (tool.category === "Monitoring") {
        states.forEach(s => {
          if (MONITORING_PRIVACY_LAWS[s]) laws.push(MONITORING_PRIVACY_LAWS[s])
        })
      }
      if (hasRegulatedStates && (tool.category === "Compensation" || tool.category === "General AI")) {
        laws.push(...applicableLaws.map(l => l.shortName))
      }
      medium.push({
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        laws,
        reason: tool.category === "Monitoring"
          ? "Employee monitoring with potential privacy implications"
          : "Has AI features that could influence employment decisions",
      })
    } else {
      low.push({
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        laws: [],
        reason: "No current AI compliance requirements identified",
      })
    }
  }

  // Custom tools (not found in our list) go to medium
  const knownIds = new Set(aiHiringTools.map(t => t.id))
  toolIds.filter(id => !knownIds.has(id) && id !== "other").forEach(id => {
    medium.push({
      toolId: id,
      toolName: id,
      category: "Custom",
      laws: [],
      reason: "Custom tool — review for AI features manually",
    })
  })

  return {
    totalTools: high.length + medium.length + low.length,
    high,
    medium,
    low,
  }
}
