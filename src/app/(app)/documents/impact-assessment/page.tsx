"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, ArrowRight, CheckCircle, FileText, AlertTriangle, 
  Download, Loader2, Info, Plus, X, Shield
} from "lucide-react"
import Link from "next/link"
import { 
  getImpactAssessments, 
  saveImpactAssessment, 
  completeImpactAssessment
} from "@/lib/actions/compliance"
import type { ImpactAssessment, DataInput } from "@/lib/types/compliance"
import { getHiringStatesAndTools } from "@/lib/actions/audit"

type WizardStep = 1 | 2 | 3 | 4 | 5

const dataInputOptions = [
  { type: 'resume', label: 'Resume/CV content', description: 'Text, skills, experience from resumes' },
  { type: 'assessment', label: 'Assessment scores', description: 'Results from skills or personality tests' },
  { type: 'interview', label: 'Interview recordings/transcripts', description: 'Video, audio, or text from interviews' },
  { type: 'application', label: 'Application responses', description: 'Answers to application questions' },
  { type: 'social', label: 'Social media profiles', description: 'LinkedIn or other social data' },
  { type: 'background', label: 'Background check data', description: 'Criminal, credit, or employment history' },
  { type: 'biometric', label: 'Biometric data', description: 'Facial recognition, voice analysis' },
  { type: 'performance', label: 'Performance data', description: 'Historical performance metrics' },
]

const protectedGroups = [
  'Race/Ethnicity',
  'Gender/Sex',
  'Age (40+)',
  'Disability status',
  'Religion',
  'National origin',
  'Pregnancy status',
  'Veteran status',
  'Sexual orientation',
  'Genetic information',
]

export default function ImpactAssessmentPage() {
  const [step, setStep] = useState<WizardStep>(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [existingAssessments, setExistingAssessments] = useState<ImpactAssessment[]>([])
  const [prefilledTools, setPrefilledTools] = useState<string[]>([])
  const [showList, setShowList] = useState(true)

  // Form state
  const [formData, setFormData] = useState<Partial<ImpactAssessment>>({
    system_name: '',
    system_purpose: '',
    vendor_name: '',
    deployment_date: '',
    ai_tools: [],
    data_inputs: [],
    data_sources: '',
    data_retention_period: '',
    affected_groups: [],
    potential_harms: '',
    risk_level: null,
    safeguards: '',
    bias_testing_date: '',
    bias_testing_results: '',
    notification_method: '',
    appeal_process: '',
    human_reviewer_name: '',
    human_reviewer_role: '',
    human_reviewer_contact: '',
    status: 'draft',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [assessments, auditData] = await Promise.all([
      getImpactAssessments(),
      getHiringStatesAndTools(),
    ])
    setExistingAssessments(assessments)
    
    // Pre-fill tools from audit
    if (auditData.tools?.length > 0) {
      setPrefilledTools(auditData.tools.map((t: { tool_name: string }) => t.tool_name))
    }
    
    setLoading(false)
  }

  const startNewAssessment = () => {
    setFormData({
      ...formData,
      ai_tools: prefilledTools,
    })
    setShowList(false)
    setStep(1)
  }

  const editAssessment = (assessment: ImpactAssessment) => {
    setFormData(assessment)
    setShowList(false)
    setStep(1)
  }

  const updateForm = (updates: Partial<ImpactAssessment>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const toggleDataInput = (type: string) => {
    const current = formData.data_inputs || []
    const exists = current.find(d => d.type === type)
    
    if (exists) {
      updateForm({ data_inputs: current.filter(d => d.type !== type) })
    } else {
      updateForm({ 
        data_inputs: [...current, { type, description: '', sensitive: false }] 
      })
    }
  }

  const toggleAffectedGroup = (group: string) => {
    const current = formData.affected_groups || []
    if (current.includes(group)) {
      updateForm({ affected_groups: current.filter(g => g !== group) })
    } else {
      updateForm({ affected_groups: [...current, group] })
    }
  }

  const addCustomTool = () => {
    const tool = prompt('Enter tool name:')
    if (tool) {
      updateForm({ ai_tools: [...(formData.ai_tools || []), tool] })
    }
  }

  const removeTool = (tool: string) => {
    updateForm({ ai_tools: (formData.ai_tools || []).filter(t => t !== tool) })
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveImpactAssessment(formData)
    if (result.assessment) {
      setFormData(result.assessment)
    }
    setSaving(false)
  }

  const handleComplete = async () => {
    if (!formData.id) {
      // Save first if new
      const saveResult = await saveImpactAssessment(formData)
      if (saveResult.assessment) {
        await completeImpactAssessment(saveResult.assessment.id)
      }
    } else {
      await completeImpactAssessment(formData.id)
    }
    await loadData()
    setShowList(true)
  }

  const nextStep = () => {
    if (step < 5) setStep((step + 1) as WizardStep)
  }

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as WizardStep)
  }

  const generateDocument = () => {
    // Generate a text document from the assessment data
    const doc = `COLORADO AI ACT IMPACT ASSESSMENT

COMPANY: ${formData.system_name}
ASSESSMENT DATE: ${new Date().toLocaleDateString()}
VERSION: ${formData.version || 1}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AI SYSTEM DESCRIPTION

System Name: ${formData.system_name}
Purpose: ${formData.system_purpose || 'Not specified'}
Vendor: ${formData.vendor_name || 'Not specified'}
Deployment Date: ${formData.deployment_date || 'Not specified'}

AI Tools in Use:
${(formData.ai_tools || []).map(t => `  • ${t}`).join('\n') || '  None specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. DATA INPUTS

Data Types Processed:
${(formData.data_inputs || []).map(d => `  • ${d.type}${d.sensitive ? ' (sensitive)' : ''}`).join('\n') || '  None specified'}

Data Sources: ${formData.data_sources || 'Not specified'}
Data Retention Period: ${formData.data_retention_period || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. DISCRIMINATION RISK ANALYSIS

Risk Level: ${formData.risk_level?.toUpperCase() || 'Not assessed'}

Protected Groups Potentially Affected:
${(formData.affected_groups || []).map(g => `  • ${g}`).join('\n') || '  None identified'}

Potential Harms:
${formData.potential_harms || 'Not specified'}

Safeguards Implemented:
${formData.safeguards || 'Not specified'}

Bias Testing:
  Date: ${formData.bias_testing_date || 'Not conducted'}
  Results: ${formData.bias_testing_results || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. TRANSPARENCY MEASURES

Notification Method: ${formData.notification_method || 'Not specified'}

Appeal Process: ${formData.appeal_process || 'Not specified'}

Human Reviewer:
  Name: ${formData.human_reviewer_name || 'Not specified'}
  Role: ${formData.human_reviewer_role || 'Not specified'}
  Contact: ${formData.human_reviewer_contact || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATION

This impact assessment was completed in accordance with the Colorado AI Act (SB24-205) requirements.

Status: ${formData.status === 'complete' ? 'COMPLETE' : 'DRAFT'}
Completed: ${formData.completed_at ? new Date(formData.completed_at).toLocaleDateString() : 'Pending'}
Expires: ${formData.expires_at ? new Date(formData.expires_at).toLocaleDateString() : 'N/A (annual renewal required)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by AIHireLaw • ${new Date().toLocaleString()}
`

    const blob = new Blob([doc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impact-assessment-${formData.system_name?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'draft'}.txt`
    a.click()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // List view
  if (showList) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/documents" className="text-gray-600 hover:text-gray-900">
                  Documents
                </Link>
                <span className="text-gray-400">/</span>
                <span className="font-medium">Impact Assessment</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Impact Assessment Wizard</h1>
              <p className="text-gray-600">
                Create and manage Colorado AI Act impact assessments
              </p>
            </div>
            <Button onClick={startNewAssessment}>
              <Plus className="w-4 h-4 mr-2" /> New Assessment
            </Button>
          </div>

          {/* Info Card */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Colorado AI Act Requirement</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Impact assessments must be completed annually or within 90 days of any substantial 
                    modification to your AI system. This wizard will guide you through the process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact Assessments</CardTitle>
              <CardDescription>View and manage your impact assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {existingAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="font-medium text-lg mb-2">No assessments yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first impact assessment to meet Colorado compliance requirements.
                  </p>
                  <Button onClick={startNewAssessment}>
                    <Plus className="w-4 h-4 mr-2" /> Create Assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {existingAssessments.map(assessment => (
                    <div 
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          assessment.status === 'complete' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {assessment.status === 'complete' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{assessment.system_name}</div>
                          <div className="text-sm text-gray-600">
                            {assessment.status === 'complete' ? (
                              <>
                                Completed {new Date(assessment.completed_at!).toLocaleDateString()}
                                {assessment.expires_at && (
                                  <> • Expires {new Date(assessment.expires_at).toLocaleDateString()}</>
                                )}
                              </>
                            ) : (
                              <>Draft • Last updated {new Date(assessment.created_at).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assessment.status === 'complete' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {assessment.status === 'complete' ? 'Complete' : 'Draft'}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => editAssessment(assessment)}>
                          {assessment.status === 'complete' ? 'View' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Wizard view
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setShowList(true)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assessments
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Impact Assessment Wizard</h1>
          <p className="text-gray-600">Step {step} of 5</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>System</span>
            <span>Data</span>
            <span>Risks</span>
            <span>Transparency</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step 1: AI System Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>AI System Details</CardTitle>
              <CardDescription>Tell us about the AI system you're assessing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">System Name *</label>
                <input
                  type="text"
                  value={formData.system_name || ''}
                  onChange={(e) => updateForm({ system_name: e.target.value })}
                  placeholder="e.g., Hiring AI System"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purpose / Description</label>
                <textarea
                  value={formData.system_purpose || ''}
                  onChange={(e) => updateForm({ system_purpose: e.target.value })}
                  placeholder="Describe what this AI system does..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.vendor_name || ''}
                    onChange={(e) => updateForm({ vendor_name: e.target.value })}
                    placeholder="e.g., HireVue"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Deployment Date</label>
                  <input
                    type="date"
                    value={formData.deployment_date || ''}
                    onChange={(e) => updateForm({ deployment_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">AI Tools Included</label>
                <p className="text-sm text-gray-600 mb-3">
                  These were pre-filled from your audit. Add or remove as needed.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.ai_tools || []).map(tool => (
                    <span 
                      key={tool}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tool}
                      <button onClick={() => removeTool(tool)} className="hover:text-blue-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addCustomTool}>
                  <Plus className="w-4 h-4 mr-1" /> Add Tool
                </Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={nextStep} disabled={!formData.system_name}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Data Inputs */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Data Inputs</CardTitle>
              <CardDescription>What data does this AI system process?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Data Types Collected</label>
                <div className="grid grid-cols-2 gap-3">
                  {dataInputOptions.map(option => (
                    <button
                      key={option.type}
                      onClick={() => toggleDataInput(option.type)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        (formData.data_inputs || []).find(d => d.type === option.type)
                          ? 'bg-blue-50 border-blue-600'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data Sources</label>
                <textarea
                  value={formData.data_sources || ''}
                  onChange={(e) => updateForm({ data_sources: e.target.value })}
                  placeholder="Where does the data come from? (e.g., job applications, ATS exports, candidate uploads)"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data Retention Period</label>
                <select
                  value={formData.data_retention_period || ''}
                  onChange={(e) => updateForm({ data_retention_period: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select retention period...</option>
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="Until deletion requested">Until deletion requested</option>
                  <option value="Indefinite">Indefinite</option>
                </select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Discrimination Risk Analysis */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Discrimination Risk Analysis</CardTitle>
              <CardDescription>Assess potential risks and safeguards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Which protected groups could be disadvantaged?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {protectedGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => toggleAffectedGroup(group)}
                      className={`p-2 text-left text-sm rounded-lg border transition-colors ${
                        (formData.affected_groups || []).includes(group)
                          ? 'bg-orange-50 border-orange-500 text-orange-800'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Potential Harms</label>
                <textarea
                  value={formData.potential_harms || ''}
                  onChange={(e) => updateForm({ potential_harms: e.target.value })}
                  placeholder="Describe potential negative impacts on candidates..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Overall Risk Level</label>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => updateForm({ risk_level: level })}
                      className={`flex-1 py-3 rounded-lg border font-medium capitalize ${
                        formData.risk_level === level
                          ? level === 'low' ? 'bg-green-50 border-green-500 text-green-700'
                          : level === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                          : 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Safeguards Implemented</label>
                <textarea
                  value={formData.safeguards || ''}
                  onChange={(e) => updateForm({ safeguards: e.target.value })}
                  placeholder="What safeguards are in place to prevent discrimination? (e.g., bias testing, human review, input validation)"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bias Testing Date</label>
                  <input
                    type="date"
                    value={formData.bias_testing_date || ''}
                    onChange={(e) => updateForm({ bias_testing_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Testing Results</label>
                  <input
                    type="text"
                    value={formData.bias_testing_results || ''}
                    onChange={(e) => updateForm({ bias_testing_results: e.target.value })}
                    placeholder="e.g., Pass, No significant bias detected"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Transparency Measures */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Transparency Measures</CardTitle>
              <CardDescription>How do you notify and support affected individuals?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Notification Method</label>
                <textarea
                  value={formData.notification_method || ''}
                  onChange={(e) => updateForm({ notification_method: e.target.value })}
                  placeholder="How do you notify candidates that AI will be used? (e.g., email disclosure, application notice, website posting)"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Appeal Process</label>
                <textarea
                  value={formData.appeal_process || ''}
                  onChange={(e) => updateForm({ appeal_process: e.target.value })}
                  placeholder="How can candidates appeal AI-assisted decisions? (Colorado requires opportunity for human review)"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Human Reviewer</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Reviewer Name</label>
                    <input
                      type="text"
                      value={formData.human_reviewer_name || ''}
                      onChange={(e) => updateForm({ human_reviewer_name: e.target.value })}
                      placeholder="e.g., Jane Smith"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reviewer Role</label>
                    <input
                      type="text"
                      value={formData.human_reviewer_role || ''}
                      onChange={(e) => updateForm({ human_reviewer_role: e.target.value })}
                      placeholder="e.g., HR Director"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Information</label>
                    <input
                      type="text"
                      value={formData.human_reviewer_contact || ''}
                      onChange={(e) => updateForm({ human_reviewer_contact: e.target.value })}
                      placeholder="e.g., appeals@company.com"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep}>
                  Review <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review & Complete */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Complete</CardTitle>
              <CardDescription>Review your impact assessment before finalizing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Sections */}
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">AI System</h4>
                  <p className="text-sm"><strong>Name:</strong> {formData.system_name}</p>
                  <p className="text-sm"><strong>Purpose:</strong> {formData.system_purpose || 'Not specified'}</p>
                  <p className="text-sm"><strong>Vendor:</strong> {formData.vendor_name || 'Not specified'}</p>
                  <p className="text-sm"><strong>Tools:</strong> {(formData.ai_tools || []).join(', ') || 'None'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Data Inputs</h4>
                  <p className="text-sm">
                    <strong>Types:</strong> {(formData.data_inputs || []).map(d => d.type).join(', ') || 'None'}
                  </p>
                  <p className="text-sm"><strong>Retention:</strong> {formData.data_retention_period || 'Not specified'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Risk Assessment</h4>
                  <p className="text-sm">
                    <strong>Risk Level:</strong>{' '}
                    <span className={`px-2 py-0.5 rounded ${
                      formData.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                      formData.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      formData.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100'
                    }`}>
                      {formData.risk_level || 'Not assessed'}
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong>Groups:</strong> {(formData.affected_groups || []).join(', ') || 'None identified'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Transparency</h4>
                  <p className="text-sm"><strong>Human Reviewer:</strong> {formData.human_reviewer_name || 'Not specified'}</p>
                  <p className="text-sm"><strong>Appeal Contact:</strong> {formData.human_reviewer_contact || 'Not specified'}</p>
                </div>
              </div>

              {/* Warning if incomplete */}
              {(!formData.system_name || !formData.human_reviewer_name) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Some fields are incomplete</h4>
                    <p className="text-sm text-yellow-700">
                      You can save as draft and complete later, or go back to fill in missing information.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Button variant="outline" onClick={prevStep} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button variant="outline" onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Save Draft'
                    )}
                  </Button>
                </div>
                <Button onClick={handleComplete} disabled={saving || !formData.system_name} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" /> Complete Assessment
                </Button>
                {formData.status === 'complete' && (
                  <Button variant="outline" onClick={generateDocument} className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download Document
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
