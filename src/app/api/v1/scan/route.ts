import { NextRequest, NextResponse } from "next/server"
import { analyzeToolStack, computeComprehensiveRisk } from "@/lib/tool-analysis"
import { stateRequirements, regulatedStates } from "@/data/states"
import { aiHiringTools } from "@/data/tools"

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60_000 // 1 minute
const RATE_LIMIT_MAX = 30 // requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT_MAX
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in 1 minute." },
      { status: 429, headers: corsHeaders() }
    )
  }

  let body: { states?: string[]; tools?: string[]; employeeCount?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders() }
    )
  }

  const { states, tools, employeeCount } = body

  if (!states || !Array.isArray(states) || states.length === 0) {
    return NextResponse.json(
      { error: "states is required and must be a non-empty array of state codes (e.g. ['IL', 'CA'])" },
      { status: 400, headers: corsHeaders() }
    )
  }
  if (!tools || !Array.isArray(tools) || tools.length === 0) {
    return NextResponse.json(
      { error: "tools is required and must be a non-empty array of tool IDs (e.g. ['hirevue', 'greenhouse'])" },
      { status: 400, headers: corsHeaders() }
    )
  }
  if (!employeeCount || typeof employeeCount !== "number" || employeeCount < 1) {
    return NextResponse.json(
      { error: "employeeCount is required and must be a positive number" },
      { status: 400, headers: corsHeaders() }
    )
  }

  // Run analysis
  const toolAnalysis = analyzeToolStack(tools, states)
  const riskAssessment = computeComprehensiveRisk(tools, states, [])

  // Get applicable state laws
  const applicableLaws = stateRequirements.filter(s => states.includes(s.code))

  // Determine risk level from overall score
  let riskLevel: "low" | "medium" | "high" | "critical"
  if (riskAssessment.overallScore >= 70) riskLevel = "critical"
  else if (riskAssessment.overallScore >= 45) riskLevel = "high"
  else if (riskAssessment.overallScore >= 20) riskLevel = "medium"
  else riskLevel = "low"

  // Compliance gaps: categories scored medium or above
  const gaps = riskAssessment.categoryScores
    .filter(c => c.score !== "low")
    .map(c => ({
      category: c.label,
      severity: c.score,
      applicableStates: c.applicableStates,
      description: c.description,
    }))

  // Build results URL
  const params = JSON.stringify({ states, tools, employeeCount })
  const resultsUrl = `https://employarmor.com/scan?results=${Buffer.from(params).toString("base64")}`

  // Available tools reference (for discovery)
  const availableTools = aiHiringTools.map(t => ({ id: t.id, name: t.name, category: t.category }))

  const response = {
    complianceScore: 100 - riskAssessment.overallScore,
    riskLevel,
    riskScore: riskAssessment.overallScore,
    gaps,
    applicableLaws: applicableLaws.map(l => ({
      state: l.code,
      stateName: l.name,
      law: l.law,
      effective: l.effective,
      requirements: l.requirements,
      penalties: l.penalties,
    })),
    toolAnalysis: {
      total: toolAnalysis.totalTools,
      high: toolAnalysis.high,
      medium: toolAnalysis.medium,
      low: toolAnalysis.low,
    },
    stateRiskMap: riskAssessment.stateRiskMap,
    resultsUrl,
    meta: {
      availableStates: regulatedStates,
      toolCount: availableTools.length,
      toolsReference: "https://employarmor.com/openapi.json",
    },
  }

  return NextResponse.json(response, { headers: corsHeaders() })
}
