'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Shield, Building2, Users, Briefcase, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { allStates } from '@/data/states'
import { aiHiringTools, toolCategories } from '@/data/tools'
import { analyzeToolStack } from '@/lib/tool-analysis'
import { createClient } from '@/lib/supabase/client'

type Step = 'states' | 'employees' | 'tools' | 'email' | 'results' | 'signup'

interface ScanData {
  states: string[]
  employeeCount: string
  tools: string[]
  email: string
  password: string
  companyName: string
}

const employeeTiers = [
  { id: '1-15', label: '1-15', description: 'Small team' },
  { id: '16-50', label: '16-50', description: 'Growing company' },
  { id: '51-100', label: '51-100', description: 'Mid-size' },
  { id: '100+', label: '100+', description: 'Enterprise' },
]

export default function ScanPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('states')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [data, setData] = useState<ScanData>({
    states: [],
    employeeCount: '',
    tools: [],
    email: '',
    password: '',
    companyName: '',
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

  const nextStep = () => {
    const steps: Step[] = ['states', 'employees', 'tools', 'email', 'results']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    const steps: Step[] = ['states', 'employees', 'tools', 'email', 'results']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submitScan = async () => {
    setIsSubmitting(true)
    
    try {
      // Run compliance analysis
      const toolAnalysis = analyzeToolStack(data.tools, data.states, [])
      
      // Calculate risk score based on high/medium risk tools
      const riskScore = Math.min(
        (toolAnalysis.high.length * 30) +
        (toolAnalysis.medium.length * 15) +
        (data.states.filter(s => ['IL', 'CO', 'CA', 'NYC', 'MD'].includes(s)).length * 15),
        100
      )

      // Build gaps from high-risk tools
      const gaps = toolAnalysis.high.map(item => ({
        tool: item.toolName,
        category: item.category,
        laws: item.laws,
        reason: item.reason,
      }))

      // Get unique applicable laws
      const applicableLaws = Array.from(new Set([
        ...toolAnalysis.high.flatMap(t => t.laws),
        ...toolAnalysis.medium.flatMap(t => t.laws),
      ]))

      setAnalysis({
        riskScore,
        riskLevel: riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
        gaps,
        applicableLaws,
        toolAnalysis,
      })

      // Save to database
      await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          states: data.states,
          employee_count: data.employeeCount,
          tools: data.tools,
          risk_score: riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
          gaps,
        }),
      })

      setStep('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error('Scan submission error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!data.companyName.trim()) {
        setError('Company name is required')
        setIsSubmitting(false)
        return
      }

      if (!data.password || data.password.length < 6) {
        setError('Password must be at least 6 characters')
        setIsSubmitting(false)
        return
      }

      // Create Supabase account
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            company_name: data.companyName,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setIsSubmitting(false)
        return
      }

      if (!authData.user) {
        setError('Failed to create account')
        setIsSubmitting(false)
        return
      }

      // Auto sign-in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        setError('Account created but failed to sign in. Please log in manually.')
        setIsSubmitting(false)
        return
      }

      // Create organization
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({
          id: authData.user.id,
          name: data.companyName,
          states: data.states,
          quiz_tools: data.tools,
          quiz_risk_score: analysis?.riskScore || null,
          employee_count: data.employeeCount,
        })

      if (orgError) {
        console.error('Failed to create organization:', orgError)
        // Continue anyway - user is created
      }

      // Create user record
      await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          org_id: authData.user.id,
          email: data.email,
          role: 'admin',
        })

      // Redirect to Stripe Checkout
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Use default price (PILOT/STARTER)
      })

      const checkoutData = await checkoutRes.json()

      if (checkoutData.url) {
        window.location.href = checkoutData.url
      } else {
        setError('Failed to create checkout session')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const progress = {
    states: 25,
    employees: 50,
    tools: 75,
    email: 100,
    results: 100,
    signup: 100,
  }[step]

  const canContinue = {
    states: data.states.length > 0,
    employees: !!data.employeeCount,
    tools: data.tools.length > 0,
    email: data.email.length > 0 && data.email.includes('@'),
    results: true,
    signup: true,
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
              : 'Answer 4 quick questions to see your risk level'
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
                {Object.entries(toolCategories).map(([catKey, catName]) => {
                  const categoryTools = aiHiringTools.filter(t => t.category === catKey)
                  if (categoryTools.length === 0) return null
                  
                  return (
                    <div key={catKey}>
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
              <Button size="lg" onClick={nextStep} disabled={!canContinue} className="gap-2">
                Continue <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Email */}
        {step === 'email' && (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Where should we send your report?</h2>
                  <p className="text-gray-500">Get your compliance report via email</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <p className="text-xs text-gray-500">
                  We'll email you a detailed compliance report. No spam, unsubscribe anytime.
                </p>
              </div>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" size="lg" onClick={prevStep} className="gap-2">
                <ArrowLeft className="w-5 h-5" /> Back
              </Button>
              <Button 
                size="lg" 
                onClick={submitScan}
                disabled={!canContinue || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? 'Analyzing...' : 'Get My Report'} <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && analysis && (
          <div className="space-y-6">
            {/* Risk Score */}
            <Card className="p-8">
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                  analysis.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                  analysis.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {analysis.riskLevel === 'High' && <AlertTriangle className="w-4 h-4" />}
                  {analysis.riskLevel} Risk
                </div>
                
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {analysis.riskScore}
                  <span className="text-2xl text-gray-400">/100</span>
                </div>
                
                <p className="text-gray-600">
                  {analysis.riskLevel === 'High' 
                    ? 'You have significant compliance gaps that need immediate attention'
                    : analysis.riskLevel === 'Medium'
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

            {/* CTA - Signup Form */}
            {!showSignupForm ? (
              <Card className="p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-3">Ready to Fix These Gaps?</h3>
                  <p className="text-blue-100 mb-6">
                    Sign up for EmployArmor and get compliant in minutes
                  </p>
                  <Button 
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => setShowSignupForm(true)}
                  >
                    Get Protected Now
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create Your Account</h3>
                <p className="text-gray-600 mb-6 text-center">One more step to get protected</p>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={data.companyName}
                      onChange={e => setData(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="Acme Inc."
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={data.password}
                      onChange={e => setData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Sign Up & Subscribe <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    You'll be redirected to Stripe to complete your subscription
                  </p>
                </form>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
