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

export function analyzeToolStack(toolIds: string[], states: string[], usages?: string[]): ToolAnalysisResult {
  const selectedTools = toolIds
    .map(id => aiHiringTools.find(t => t.id === id))
    .filter(Boolean) as typeof aiHiringTools

  const hasRegulatedStates = states.some(s => regulatedStates.includes(s))
  const applicableLaws = states.flatMap(s => STATE_LAWS[s] || [])

  const high: ToolAnalysisItem[] = []
  const medium: ToolAnalysisItem[] = []
  const low: ToolAnalysisItem[] = []

  // Video interview tools that trigger biometric/wiretapping/lie-detector
  const videoInterviewToolIds = new Set(['hirevue', 'spark-hire'])
  
  // Background check tools that trigger FCRA
  const backgroundCheckToolIds = new Set(['checkr', 'hireright', 'sterling', 'goodhire'])
  
  // All-party consent states for wiretapping
  const allPartyConsentStates = new Set(['CA', 'FL', 'IL', 'PA', 'MA', 'MD', 'WA', 'CT', 'NH', 'NV', 'DE', 'MI', 'MT'])
  
  // Pay transparency states
  const payTransparencyStates = new Set(['CO', 'CA', 'NY', 'WA', 'MA', 'IL', 'CT'])

  for (const tool of selectedTools) {
    if (tool.id === "other") continue

    const toolLaws: string[] = []
    let isHighRisk = false
    let riskReason = ""

    // Video interview tools
    if (videoInterviewToolIds.has(tool.id)) {
      isHighRisk = true
      toolLaws.push("Biometric Privacy")
      
      // Check if in all-party consent state
      if (states.some(s => allPartyConsentStates.has(s))) {
        toolLaws.push("Wiretapping/Recording Consent")
      }
      
      // Video analysis could trigger lie detector laws
      if (usages?.includes('facial-analysis') || usages?.includes('integrity-scoring')) {
        toolLaws.push("Lie Detector/Polygraph Laws")
      }
      
      riskReason = "Video interview analysis triggers biometric and consent laws"
    }
    
    // Background check tools trigger FCRA
    if (backgroundCheckToolIds.has(tool.id) || usages?.includes('third-party-reports')) {
      toolLaws.push("FCRA (Fair Credit Reporting Act)")
      if (!isHighRisk) {
        isHighRisk = true
        riskReason = "Third-party screening reports require FCRA compliance"
      }
    }
    
    // Salary filtering triggers pay transparency
    if (usages?.includes('salary-filtering') && states.some(s => payTransparencyStates.has(s))) {
      toolLaws.push("Pay Transparency Laws")
      if (!isHighRisk) {
        isHighRisk = true
        riskReason = "Salary-based filtering in pay transparency state"
      }
    }

    // Standard high-risk tools in regulated states
    if (HIGH_RISK_TOOL_IDS.has(tool.id) && hasRegulatedStates) {
      isHighRisk = true
      toolLaws.push(...applicableLaws.map(l => l.shortName))
      if (!riskReason) {
        riskReason = `Uses AI for employment decisions in regulated state(s)`
      }
    }

    // Add federal baseline laws for all tools
    const federalLaws = ["Anti-Discrimination (Title VII)", "Age Discrimination (ADEA)", "Disability (ADA)"]
    
    if (isHighRisk) {
      high.push({
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        laws: [...new Set([...toolLaws, ...federalLaws])],
        reason: riskReason,
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
        laws: [...new Set([...laws, ...federalLaws])],
        reason: tool.category === "Monitoring"
          ? "Employee monitoring with potential privacy implications"
          : "Has AI features that could influence employment decisions",
      })
    } else {
      low.push({
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        laws: federalLaws,
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
      laws: ["Anti-Discrimination (Title VII)", "Age Discrimination (ADEA)", "Disability (ADA)"],
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
