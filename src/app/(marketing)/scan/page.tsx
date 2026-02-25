'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Shield, Building2, Users, Briefcase, FileText, Bell, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { allStates } from '@/data/states'
import { aiHiringTools, toolCategories } from '@/data/tools'
import { analyzeToolStack } from '@/lib/tool-analysis'

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

export default function ScanPage() {
  const [step, setStep] = useState<Step>('states')
  const [analysis, setAnalysis] = useState<any>(null)

  // Scroll to top on mount (fixes issue when navigating from state pages)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [data, setData] = useState<ScanData>({
    states: [],
    employeeCount: '',
    tools: [],
  })

  const toggleState = (code: string) => {
    setData(prev => ({
      ...prev,
      states: prev.states.includes(code)
        ? prev.states.filter(s => s !== code)
        : [...prev.states, code]
    }))
  }

  const toggleTool = (id: string) => {
    setData(prev => ({
      ...prev,
      tools: prev.tools.includes(id)
        ? prev.tools.filter(t => t !== id)
        : [...prev.tools, id]
    }))
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

    setAnalysis({
      riskScore,
      complianceScore,
      complianceLevel,
      gaps,
      applicableLaws,
      toolAnalysis,
    })

    setStep('results')
    scrollToTop()
  }

  const progress = {
    states: 33,
    employees: 66,
    tools: 100,
    results: 100,
  }[step]

  const canContinue = {
    states: data.states.length > 0,
    employees: !!data.employeeCount,
    tools: data.tools.length > 0,
    results: true,
  }[step]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 pt-16">
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {allStates.map(state => (
                  <button
                    key={state.code}
                    onClick={() => toggleState(state.code)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      data.states.includes(state.code)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{state.code}</div>
                    <div className="text-xs text-gray-500">{state.name}</div>
                  </button>
                ))}
              </div>

              {data.states.length > 0 && (
                <div className="mt-6 text-sm text-gray-600">
                  Selected: {data.states.join(', ')}
                </div>
              )}
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
                  <p className="text-gray-500">Select all that apply</p>
                </div>
              </div>

              <div className="space-y-4">
                {toolCategories.map((catName) => {
                  const categoryTools = aiHiringTools.filter(t => t.category === catName)
                  if (categoryTools.length === 0) return null

                  return (
                    <div key={catName}>
                      <div className="font-semibold text-sm text-gray-700 mb-2">{catName}</div>
                      <div className="grid md:grid-cols-2 gap-2">
                        {categoryTools.slice(0, 10).map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => toggleTool(tool.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              data.tools.includes(tool.id)
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                          </button>
                        ))}
                      </div>
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
              <Button size="lg" onClick={runAnalysis} disabled={!canContinue} className="gap-2">
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
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

            {/* Compliance Gaps */}
            {analysis.gaps.length > 0 && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Compliance Gaps</h3>
                <div className="space-y-4">
                  {analysis.gaps.slice(0, 5).map((gap: any, idx: number) => (
                    <div key={idx} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                      <div className="font-semibold text-gray-900">{gap.tool}</div>
                      <div className="text-sm text-gray-700 mt-1">{gap.reason}</div>
                      <div className="text-xs text-gray-600 mt-2">
                        Applicable laws: {gap.laws.slice(0, 3).join(', ')}
                        {gap.laws.length > 3 && ` +${gap.laws.length - 3} more`}
                      </div>
                    </div>
                  ))}

                  {analysis.gaps.length > 5 && (
                    <p className="text-sm text-gray-500">
                      ...and {analysis.gaps.length - 5} more gap{analysis.gaps.length - 5 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </Card>
            )}

            {/* CTA Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/signup" className="block">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Get Detailed Report</h4>
                  <p className="text-sm text-gray-500">Full compliance breakdown with action items</p>
                </Card>
              </Link>
              <Link href="/signup" className="block">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Set Up Monitoring</h4>
                  <p className="text-sm text-gray-500">Get alerts when new laws affect you</p>
                </Card>
              </Link>
              <Link href="/signup" className="block">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow h-full">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">Fix These Gaps Now</h4>
                  <p className="text-sm text-gray-500">Guided compliance workflow to get compliant fast</p>
                </Card>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
