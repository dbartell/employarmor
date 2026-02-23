'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowRight, Shield, 
  AlertCircle, Calendar, FileText, Clock, 
  Users, ClipboardCheck, ShieldCheck, Award,
  BookOpen, FileCheck, UserCheck, Building2, TrendingUp
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { 
  getRequirementsForStates,
  getRequirementsByPhase,
  ComplianceRequirement,
  StateCompliance
} from "@/data/compliance-requirements"
import { PaywallModal } from "@/components/paywall-modal"
import { checkPaywallStatus, PaywallStatus } from "@/lib/paywall"

// ============================================================
// CIRCULAR PROGRESS RING COMPONENT
// ============================================================
function CircularProgress({ 
  percentage, 
  size = 200, 
  strokeWidth = 12,
  isComplete = false,
  label = 'Complete',
  color = 'blue',
}: { 
  percentage: number
  size?: number
  strokeWidth?: number
  isComplete?: boolean
  label?: string
  color?: 'red' | 'amber' | 'green' | 'blue'
}) {
  const colorGradients: Record<string, [string, string]> = {
    red: ['#ef4444', '#dc2626'],
    amber: ['#f59e0b', '#d97706'],
    green: ['#22c55e', '#16a34a'],
    blue: ['#3b82f6', '#8b5cf6'],
  }
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isComplete ? "#22c55e" : colorGradients[color][0]} />
            <stop offset="100%" stopColor={isComplete ? "#16a34a" : colorGradients[color][1]} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${isComplete ? 'text-green-600' : 'text-white'}`}>
          {animatedPercentage}%
        </span>
        <span className="text-sm text-white/80 mt-1">{label}</span>
      </div>
    </div>
  )
}

// ============================================================
// CONFETTI ANIMATION COMPONENT
// ============================================================
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}

// ============================================================
// NEXT ACTION ITEM DESCRIPTIONS
// ============================================================
const ACTION_DESCRIPTIONS: Record<string, string> = {
  disclosure: 'Required by law — employees must know what AI tools are used in decisions about them.',
  notice: 'Legally required notice before AI is used in employment decisions.',
  training: 'Ensure your team understands AI compliance obligations.',
  consent: 'Some states require explicit employee consent before using AI tools.',
  audit: 'Identify your risk exposure and get a compliance roadmap.',
  impact: 'Assess how AI tools affect your workforce — required in several states.',
  handbook: 'Update your employee handbook with AI usage policies.',
}

function getActionDescription(reqId: string): string {
  for (const [key, desc] of Object.entries(ACTION_DESCRIPTIONS)) {
    if (reqId.includes(key)) return desc
  }
  return 'Complete this to improve your compliance score.'
}

function getActionIcon(reqId: string) {
  const cls = "w-5 h-5"
  if (reqId.includes('disclosure') || reqId.includes('notice')) return <FileCheck className={cls} />
  if (reqId.includes('training')) return <BookOpen className={cls} />
  if (reqId.includes('consent')) return <UserCheck className={cls} />
  if (reqId.includes('audit') || reqId.includes('impact')) return <ClipboardCheck className={cls} />
  return <FileText className={cls} />
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================
export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<{
    orgName: string
    states: string[]
    completedDocTypes: string[]
    hasDisclosure: boolean
    hasTraining: boolean
    hasAudit: boolean
    riskScore: number | null
    trainingComplete: number
    trainingTotal: number
    consentCount: number
    subscriptionStatus: string | null
    trialStartedAt: Date | null
    documentsGenerated: number
    quizTools: string[]
    quizUsages: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallStatus, setPaywallStatus] = useState<PaywallStatus | null>(null)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const orgId = user.id
      const userEmail = user.email

      // Bootstrap org if needed
      const { data: orgCheck } = await supabase.from('organizations').select('id').eq('id', orgId).single()
      
      if (!orgCheck) {
        const storedQuizData = typeof window !== 'undefined' ? localStorage.getItem('employarmor_onboard_data') : null
        let quizData = null
        if (storedQuizData) {
          try { quizData = JSON.parse(storedQuizData) } catch {}
        }
        try {
          await fetch('/api/dashboard/bootstrap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: orgId, email: userEmail, quizData }),
          })
        } catch {}
      }

      const [orgRes, docsRes, disclosureRes, trainingCompleteRes, trainingTotalRes, auditsRes, consentsRes, hiringStatesRes, leadsRes] = await Promise.all([
        supabase.from('organizations').select('name, states, primary_state, active_states, subscription_status, trial_started_at, documents_generated, quiz_tools, quiz_usages').eq('id', orgId).single(),
        supabase.from('documents').select('doc_type').eq('org_id', orgId),
        supabase.from('disclosure_pages').select('is_published').eq('organization_id', orgId).single(),
        supabase.from('training_assignments').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'completed'),
        supabase.from('training_assignments').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        supabase.from('audits').select('risk_score').eq('org_id', orgId).order('created_at', { ascending: false }).limit(1),
        supabase.from('consents').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        supabase.from('hiring_states').select('state_code').eq('org_id', orgId),
        userEmail ? supabase.from('leads').select('risk_score, states, tools').eq('email', userEmail).order('created_at', { ascending: false }).limit(1) : Promise.resolve({ data: null }),
      ])

      const auditRiskScore = auditsRes.data?.[0]?.risk_score ?? null
      const leadRiskScore = leadsRes.data?.[0]?.risk_score ?? null
      const riskScore = auditRiskScore ?? leadRiskScore

      const orgPrimaryState = orgRes.data?.primary_state
      const orgStates = orgRes.data?.states || []
      const hiringStates = hiringStatesRes.data?.map(s => s.state_code) || []
      const leadStates = leadsRes.data?.[0]?.states || []
      
      let primaryState = orgPrimaryState
      if (!primaryState) {
        primaryState = orgStates[0] || hiringStates[0] || leadStates[0] || 'IL'
      }
      
      const states = primaryState ? [primaryState] : ['IL']

      setData({
        orgName: orgRes.data?.name || 'Your Company',
        states,
        completedDocTypes: docsRes.data?.map(d => d.doc_type) || [],
        hasDisclosure: disclosureRes.data?.is_published || false,
        hasTraining: (trainingCompleteRes.count || 0) > 0,
        hasAudit: riskScore !== null,
        riskScore,
        trainingComplete: trainingCompleteRes.count || 0,
        trainingTotal: trainingTotalRes.count || 0,
        consentCount: consentsRes.count || 0,
        subscriptionStatus: orgRes.data?.subscription_status || null,
        trialStartedAt: orgRes.data?.trial_started_at ? new Date(orgRes.data.trial_started_at) : null,
        documentsGenerated: orgRes.data?.documents_generated || 0,
        quizTools: orgRes.data?.quiz_tools || [],
        quizUsages: orgRes.data?.quiz_usages || [],
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  const dashboardState = useMemo(() => {
    if (!data) return null

    const hasStates = data.states.length > 0
    const { stateRequirements, generalRequirements: general } = getRequirementsForStates(data.states)

    const isComplete = (reqId: string, docType?: string): boolean => {
      if (docType && data.completedDocTypes.includes(docType)) return true
      if (reqId === 'training' && data.hasTraining) return true
      if (reqId.includes('audit') && data.hasAudit) return true
      if (reqId.includes('disclosure') && data.hasDisclosure) return true
      return false
    }

    let totalReqs = 0
    let completedReqs = 0
    
    stateRequirements.forEach(({ requirements }) => {
      requirements.forEach(req => {
        totalReqs++
        if (isComplete(req.id, req.docType)) completedReqs++
      })
    })
    general.forEach(req => {
      totalReqs++
      if (isComplete(req.id, req.docType)) completedReqs++
    })

    const progress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0
    const allComplete = completedReqs === totalReqs && totalReqs > 0

    // Build top 3 incomplete items
    const incompleteItems: { requirement: ComplianceRequirement; state?: StateCompliance }[] = []
    const phasedRequirements = getRequirementsByPhase(stateRequirements, general)
    const phases = ['today', 'this_week', 'setup_once'] as const
    
    for (const phase of phases) {
      for (const item of phasedRequirements[phase]) {
        if (!isComplete(item.requirement.id, item.requirement.docType) && incompleteItems.length < 3) {
          incompleteItems.push(item)
        }
      }
    }

    return {
      hasStates,
      totalReqs,
      completedReqs,
      progress,
      allComplete,
      incompleteItems,
    }
  }, [data])

  const handleTaskClick = (href: string) => {
    if (!data) return
    
    const status = checkPaywallStatus({
      trialStartedAt: data.trialStartedAt,
      documentsGenerated: data.documentsGenerated,
      subscriptionStatus: data.subscriptionStatus,
    })
    
    if (status.isSubscribed) {
      router.push(href)
      return
    }
    
    setPaywallStatus(status)
    setPendingNavigation(href)
    setShowPaywall(true)
  }

  // Only trigger confetti at 100%
  useEffect(() => {
    if (dashboardState?.allComplete) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [dashboardState?.allComplete])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!data || !dashboardState) {
    return <div className="p-8">Loading...</div>
  }

  const { hasStates, totalReqs, completedReqs, progress, allComplete, incompleteItems } = dashboardState
  const scoreColor = progress >= 70 ? 'green' : progress >= 40 ? 'amber' : 'red'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {showConfetti && <Confetti />}
      
      {showPaywall && paywallStatus && (
        <PaywallModal
          status={paywallStatus}
          onClose={() => {
            setShowPaywall(false)
            setPendingNavigation(null)
          }}
          onUpgrade={() => {
            router.push('/signup')
          }}
        />
      )}
      
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        
        {/* ============================================================ */}
        {/* HERO — COMPLIANCE SCORE */}
        {/* ============================================================ */}
        <div className={`relative overflow-hidden rounded-2xl mb-8 ${
          allComplete 
            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500' 
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
        }`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative py-10 px-6 md:px-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4 text-white/70 text-sm">
              <Building2 className="w-4 h-4" />
              <span>{data.orgName}</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-5">
              <CircularProgress 
                percentage={progress} 
                size={180} 
                strokeWidth={14}
                isComplete={allComplete}
                label="Compliance"
                color={scoreColor}
              />
            </div>

            {allComplete ? (
              <>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span>🎉</span> You're Compliant!
                </h1>
                <p className="text-white/80 mt-2">All {totalReqs} requirements complete.</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-medium">Compliance Champion</span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">
                  {completedReqs} of {totalReqs} tasks complete
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                    progress >= 70 
                      ? 'bg-green-500/80 text-white' 
                      : progress >= 40 
                        ? 'bg-amber-500/80 text-white'
                        : 'bg-red-500/80 text-white'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                    {progress >= 70 ? 'Protected' : progress >= 40 ? 'In Progress' : 'At Risk'}
                  </div>
                  {data.riskScore !== null && (
                    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm text-white">
                      <AlertCircle className="w-4 h-4" />
                      Risk: {data.riskScore}/100
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* NO STATES — ONBOARDING */}
        {/* ============================================================ */}
        {!hasStates && (
          <Link href="/audit">
            <div className="group bg-white rounded-2xl border-2 border-dashed border-blue-300 p-8 mb-8 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">Let's get started</div>
                    <div className="text-gray-600 mt-1">
                      Tell us where you hire and what tools you use to see your compliance requirements.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* ============================================================ */}
        {/* WHAT TO DO NEXT */}
        {/* ============================================================ */}
        {hasStates && !allComplete && incompleteItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">What to do next</h2>
            <div className="space-y-3">
              {incompleteItems.map(({ requirement: req, state }) => (
                <div
                  key={`${req.id}-${state?.code || 'general'}`}
                  onClick={() => handleTaskClick(req.href)}
                  className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      {getActionIcon(req.id)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-gray-900">{req.title}</h3>
                        {state && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                            {state.code}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          req.phase === 'today' 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {req.phase === 'today' ? 'Required' : 'Recommended'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{getActionDescription(req.id)}</p>
                      {req.estimatedTime && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Clock className="w-3 h-3" />
                          {req.estimatedTime}
                        </span>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <div className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium group-hover:bg-blue-700 transition-colors">
                        Start
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* QUICK STATS ROW */}
        {/* ============================================================ */}
        {hasStates && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.documentsGenerated}</div>
                  <div className="text-xs text-gray-500">Documents Generated</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.consentCount}</div>
                  <div className="text-xs text-gray-500">Employees Notified</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {data.trainingTotal > 0 ? `${data.trainingComplete}/${data.trainingTotal}` : '—'}
                  </div>
                  <div className="text-xs text-gray-500">Training Completed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.quizTools.length}</div>
                  <div className="text-xs text-gray-500">Tools Registered</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FOOTER */}
        {/* ============================================================ */}
        <div className="mt-12 text-center border-t pt-8">
          <div className="inline-flex items-center gap-2 text-gray-500 mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Need expert guidance?</span>
          </div>
          <p className="text-sm">
            <a 
              href="https://calendly.com/employarmor/compliance-review" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Book a free compliance review →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
