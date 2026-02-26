'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Shield, Building2, Users, Briefcase, FileText, Bell, Zap, Loader2, Check, X, Search, ChevronDown, ChevronUp, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { allStates } from '@/data/states'
import { aiHiringTools, toolCategories } from '@/data/tools'
import { analyzeToolStack } from '@/lib/tool-analysis'
import { createClient } from '@/lib/supabase/client'

type Step = 'states' | 'employees' | 'tools' | 'results'

interface ScanData {
  states: string[]
  employeeCount: string
  tools: string[]
}

const employeeTiers = [
  { id: '1-15', label: '1-15', description: 'Small team' },
  { id: '16-50', label: '16-50', description: 'Growing company' },
  { id: '51-100', label: '51-100', description: 'Mid-size' },
  { id: '100+', label: '100+', description: 'Enterprise' },
]

const POPULAR_TOOLS = [
  'chatgpt',
  'github-copilot',
  'gemini',
  'claude',
  'linkedin-recruiter',
  'indeed',
  'hirevue',
  'greenhouse'
]

// Password validation helper
const validatePassword = (password: string) => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password)
  }
}

export default function ScanPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('states')
  const [analysis, setAnalysis] = useState<any>(null)
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [signupForm, setSignupForm] = useState({ email: '', password: '', company: '' })
  const [toolSearch, setToolSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showPasswordValidation, setShowPasswordValidation] = useState(false)

  // Scroll to top on mount (fixes issue when navigating from state pages)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [data, setData] = useState<ScanData>({
    states: [],
    employeeCount: '',
    tools: [],
  })

  const passwordValidation = useMemo(() => validatePassword(signupForm.password), [signupForm.password])

  const toggleState = (code: string) => {
    setData(prev => ({
      ...prev,
      states: prev.states.includes(code)
        ? prev.states.filter(s => s !== code)
        : [...prev.states, code]
    }))
  }

  const selectAllStates = () => {
    setData(prev => ({ ...prev, states: allStates.map(s => s.code) }))
  }

  const deselectAllStates = () => {
    setData(prev => ({ ...prev, states: [] }))
  }

  const toggleTool = (id: string) => {
    setData(prev => ({
      ...prev,
      tools: prev.tools.includes(id)
        ? prev.tools.filter(t => t !== id)
        : [...prev.tools, id]
    }))
  }

  const toggleCategory = (catName: string) => {
    setExpandedCategories(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    )
  }

  const skipTools = () => {
    setData(prev => ({ ...prev, tools: [] }))
    runAnalysis()
  }

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  const nextStep = () => {
    const steps: Step[] = ['states', 'employees', 'tools', 'results']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
      scrollToTop()
    }
  }

  const prevStep = () => {
    const steps: Step[] = ['states', 'employees', 'tools', 'results']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
      scrollToTop()
    }
  }

  const runAnalysis = () => {
    const toolAnalysis = analyzeToolStack(data.tools, data.states, [])

    const riskScore = Math.min(
      (toolAnalysis.high.length * 30) +
      (toolAnalysis.medium.length * 15) +
      (data.states.filter(s => ['IL', 'CO', 'CA', 'NYC', 'MD', 'TX'].includes(s)).length * 15),
      100
    )

    const gaps = toolAnalysis.high.map(item => ({
      tool: item.toolName,
      category: item.category,
      laws: item.laws,
      reason: item.reason,
    }))

    const applicableLaws = Array.from(new Set([
      ...toolAnalysis.high.flatMap(t => t.laws),
      ...toolAnalysis.medium.flatMap(t => t.laws),
    ]))

    const complianceScore = 100 - riskScore
    const complianceLevel = complianceScore >= 70 ? 'Good' : complianceScore >= 40 ? 'Fair' : 'Poor'

    // Generate specific compliance gaps based on states
    const specificGaps = []
    if (data.states.includes('IL')) {
      specificGaps.push({
        type: 'error',
        title: 'Missing Candidate Disclosure Notice',
        description: 'Required by Illinois HB 3773 (effective Jan 1, 2026)'
      })
    }
    if (data.states.includes('CO')) {
      specificGaps.push({
        type: 'error',
        title: 'No AI Bias Audit',
        description: 'Required by Colorado AI Act (effective Jun 30, 2026)'
      })
    }
    if (data.tools.length > 0) {
      specificGaps.push({
        type: 'warning',
        title: 'Team Not Trained on AI Compliance',
        description: 'Recommended best practice for organizations using AI tools'
      })
    }

    setAnalysis({
      riskScore,
      complianceScore,
      complianceLevel,
      gaps,
      applicableLaws,
      toolAnalysis,
      specificGaps,
    })

    setStep('results')
    scrollToTop()
  }

  const stepIndex = {
    states: 0,
    employees: 1,
    tools: 2,
    results: 3,
  }[step]

  const stepNames = ['Select States', 'Company Size', 'AI Tools', 'Results']

  const progress = {
    states: 25,
    employees: 50,
    tools: 75,
    results: 100,
  }[step]

  const canContinue = {
    states: data.states.length > 0,
    employees: !!data.employeeCount,
    tools: true, // Can skip tools
    results: true,
  }[step]

  // Filter tools based on search
  const filteredTools = useMemo(() => {
    if (!toolSearch) return aiHiringTools
    const searchLower = toolSearch.toLowerCase()
    return aiHiringTools.filter(tool =>
      tool.name.toLowerCase().includes(searchLower) ||
      tool.category.toLowerCase().includes(searchLower)
    )
  }, [toolSearch])

  // Group filtered tools by category
  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof aiHiringTools> = {}
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = []
      }
      grouped[tool.category].push(tool)
    })
    return grouped
  }, [filteredTools])

  const popularTools = useMemo(() => 
    aiHiringTools.filter(t => POPULAR_TOOLS.includes(t.id)),
    []
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Indicator */}
      {step !== 'results' && (
        <div className="pt-8 pb-4">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center justify-between mb-2">
              {stepNames.slice(0, 3).map((name, idx) => (
                <div key={name} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      idx < stepIndex
                        ? 'bg-green-500 text-white'
                        : idx === stepIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {idx < stepIndex ? <Check className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div className={`mt-2 text-xs md:text-sm font-medium text-center ${
                      idx <= stepIndex ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {name}
                    </div>
                  </div>
                  {idx < 2 && (
                    <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                      idx < stepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Step {stepIndex + 1} of 3
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Free Compliance Scan
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {step === 'results' ? 'Your Compliance Report' : 'Find Your Compliance Gaps'}
          </h1>
          <p className="text-xl text-gray-600">
            {step === 'results'
              ? 'See where you stand with AI hiring laws'
              : 'Answer 3 quick questions to see your compliance score'
            }
          </p>
        </div>

        {/* Step 1: States */}
        {step === 'states' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">What state(s) do you operate in?</h2>
                  <p className="text-gray-500">Select all states where you hire employees</p>
                </div>
              </div>

              {/* State counter and Select All/Deselect All buttons */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700">
                  {data.states.length > 0 ? (
                    <span className="text-blue-600">{data.states.length} state{data.states.length !== 1 ? 's' : ''} selected</span>
                  ) : (
                    <span className="text-gray-400">No states selected</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllStates}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={deselectAllStates}
                    className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {allStates.map(state => (
                  <button
                    key={state.code}
                    onClick={() => toggleState(state.code)}
                    className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                      data.states.includes(state.code)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {data.states.includes(state.code) && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 fill-blue-50" />
                      </div>
                    )}
                    <div className="font-bold text-gray-900">{state.code}</div>
                    <div className="text-xs text-gray-500">{state.name}</div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={nextStep}
                disabled={!canContinue}
                className="gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Employee Count */}
        {step === 'employees' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">How many employees do you have?</h2>
                  <p className="text-gray-500">This helps determine which laws apply</p>
                </div>
              </div>

              <div className="grid gap-4">
                {employeeTiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setData(prev => ({ ...prev, employeeCount: tier.id }))}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      data.employeeCount === tier.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xl text-gray-900">{tier.label} employees</div>
                        <div className="text-gray-500">{tier.description}</div>
                      </div>
                      {data.employeeCount === tier.id && (
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" size="lg" onClick={prevStep} className="gap-2">
                <ArrowLeft className="w-5 h-5" /> Back
              </Button>
              <Button size="lg" onClick={nextStep} disabled={!canContinue} className="gap-2">
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Tools */}
        {step === 'tools' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Which AI tools do you use in hiring?</h2>
                  <p className="text-gray-500">Select all that apply (or skip this step)</p>
                </div>
              </div>

              {/* Search input */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    placeholder="Search tools..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Popular Tools Section */}
              {!toolSearch && (
                <div className="mb-6">
                  <div className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Popular Tools
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {popularTools.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => toggleTool(tool.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          data.tools.includes(tool.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                          {data.tools.includes(tool.id) && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Categories */}
              <div className="space-y-3">
                {Object.entries(toolsByCategory).map(([catName, tools]) => {
                  if (tools.length === 0) return null
                  const isExpanded = expandedCategories.includes(catName)
                  const isPopularCategory = catName === 'Popular Tools'

                  return (
                    <div key={catName} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCategory(catName)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-700">{catName}</span>
                          <span className="text-xs text-gray-500">({tools.length})</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 bg-white">
                          <div className="grid md:grid-cols-2 gap-2">
                            {tools.slice(0, 20).map(tool => (
                              <button
                                key={tool.id}
                                onClick={() => toggleTool(tool.id)}
                                className={`p-3 rounded-lg border text-left transition-all ${
                                  data.tools.includes(tool.id)
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                                  {data.tools.includes(tool.id) && (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {data.tools.length > 0 && (
                <div className="mt-6 text-sm text-gray-600">
                  {data.tools.length} tool{data.tools.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" size="lg" onClick={prevStep} className="gap-2">
                <ArrowLeft className="w-5 h-5" /> Back
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={skipTools}
                  className="gap-2"
                >
                  I don't use AI tools
                </Button>
                <Button size="lg" onClick={runAnalysis} className="gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && analysis && (
          <div className="space-y-6">
            {/* Compliance Score */}
            <Card className="p-8">
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                  analysis.complianceLevel === 'Good' ? 'bg-green-100 text-green-700' :
                  analysis.complianceLevel === 'Fair' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {analysis.complianceLevel === 'Poor' && <AlertTriangle className="w-4 h-4" />}
                  {analysis.complianceLevel}
                </div>

                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {analysis.complianceScore}
                  <span className="text-2xl text-gray-400">%</span>
                </div>

                <p className="text-lg text-gray-500 mb-1">Compliance Score</p>

                <p className="text-gray-600">
                  {analysis.complianceLevel === 'Poor'
                    ? 'You have significant compliance gaps that need immediate attention'
                    : analysis.complianceLevel === 'Fair'
                    ? 'You have some compliance gaps to address'
                    : 'You\'re in good shape, but stay vigilant'
                  }
                </p>
              </div>
            </Card>

            {/* Your Compliance Gaps */}
            {analysis.specificGaps && analysis.specificGaps.length > 0 && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Compliance Gaps</h3>
                <div className="space-y-3">
                  {analysis.specificGaps.map((gap: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-4 rounded-lg ${
                        gap.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {gap.type === 'error' ? (
                          <X className="w-5 h-5 text-red-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{gap.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{gap.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* How we calculated your score - expandable */}
                <details className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700">
                    How we calculated your score
                  </summary>
                  <div className="mt-3 text-sm text-gray-600 space-y-2">
                    <p>We analyzed your responses based on:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>{data.states.length} state(s) selected with varying AI hiring regulations</li>
                      <li>{data.tools.length} AI tool(s) in use that may require compliance documentation</li>
                      <li>Company size: {data.employeeCount} employees</li>
                      <li>High-risk gaps found: {analysis.gaps.length}</li>
                    </ul>
                    <p className="mt-2">
                      States with strict AI hiring laws (IL, CO, CA, NYC) lower your score if you're missing required documentation.
                    </p>
                  </div>
                </details>
              </Card>
            )}

            {/* Applicable Laws */}
            {analysis.applicableLaws.length > 0 && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Laws That Apply to You</h3>
                <div className="space-y-3">
                  {analysis.applicableLaws.slice(0, 8).map((law: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">{law}</div>
                      </div>
                    </div>
                  ))}
                  {analysis.applicableLaws.length > 8 && (
                    <p className="text-sm text-gray-500">
                      ...and {analysis.applicableLaws.length - 8} more
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* Trust Signals */}
            <div className="text-center py-6 border-t border-b border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <p className="text-gray-900 font-semibold">Trusted by 1,000+ companies for AI compliance</p>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
              <div className="mt-3">
                <Link href="/privacy" className="text-sm text-blue-600 hover:text-blue-700 underline">
                  Read our Privacy Policy
                </Link>
              </div>
            </div>

            {/* Inline Signup Form */}
            <Card className="p-8 border-2 border-blue-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Full Compliance Dashboard</h3>
                <p className="text-gray-600">Create your free account to track compliance, generate documents, and fix these gaps.</p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSignupLoading(true)
                  setSignupError(null)

                  try {
                    const res = await fetch('/api/onboard/signup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: signupForm.email,
                        password: signupForm.password,
                        company: signupForm.company,
                        states: data.states,
                        tools: data.tools,
                        employeeCount: data.employeeCount,
                        riskScore: analysis.riskScore,
                      }),
                    })

                    const result = await res.json()

                    if (!res.ok) {
                      setSignupError(result.error || 'Failed to create account')
                      setSignupLoading(false)
                      return
                    }

                    if (result.existingUser) {
                      setSignupError(result.magicLinkSent
                        ? 'Account already exists. Check your email for a sign-in link.'
                        : 'Account already exists. Please sign in.')
                      setSignupLoading(false)
                      return
                    }

                    // Auto sign-in with temp password
                    const supabase = createClient()
                    const { error: signInError } = await supabase.auth.signInWithPassword({
                      email: result.email,
                      password: result.tempPassword,
                    })

                    if (signInError) {
                      setSignupError('Account created but sign-in failed. Please sign in manually.')
                      setSignupLoading(false)
                      return
                    }

                    router.push('/dashboard')
                  } catch {
                    setSignupError('Something went wrong. Please try again.')
                    setSignupLoading(false)
                  }
                }}
                className="space-y-4 max-w-md mx-auto"
              >
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={signupLoading}
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    required
                    minLength={6}
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    onFocus={() => setShowPasswordValidation(true)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={signupLoading}
                  />
                  {/* Password Requirements */}
                  {showPasswordValidation && signupForm.password && (
                    <div className="mt-2 space-y-1">
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordValidation.minLength ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordValidation.hasUppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordValidation.hasNumber ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        <span>One number</span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    id="signup-company"
                    type="text"
                    required
                    value={signupForm.company}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={signupLoading}
                  />
                </div>

                {signupError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {signupError}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={signupLoading}>
                  {signupLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trust Signals Below Button */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
                  <Lock className="w-4 h-4" />
                  <span>Your data is encrypted and secure</span>
                  <span className="text-gray-300">•</span>
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </Link>
                </div>

                <p className="text-xs text-center text-gray-500">
                  Free account includes full dashboard access. No credit card required.
                </p>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
