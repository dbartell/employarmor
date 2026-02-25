"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, Clock, Users, CheckCircle, AlertTriangle, 
  Mail, Download, Plus, TrendingUp, BookOpen, Shield, Zap, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox'
import { bulkAssignModules, exportComplianceReport } from '@/lib/actions/training-modules'
import { trackEvent } from '@/components/GoogleAnalytics'
import { usePaywall } from '@/hooks/use-paywall'
import { ActionPaywallModal } from '@/components/paywall-modal'

interface TrainingModule {
  id: string
  title: string
  description: string
  audience: string[]
  icon: string
  duration_minutes: number
  lesson_count: number
  content: any[]
  sort_order: number
  tier?: number
  trigger_type?: string
  trigger_value?: string | null
}

interface RecommendedModule {
  id: string
  title: string
  description: string
  trigger_type: string
  trigger_value: string | null
  tier: number
  reason: string
}

interface EnrollmentWithDetails {
  id: string
  user_id: string
  module_id: string
  status: string
  progress: number
  completed_at: string | null
  expires_at: string | null
  module?: TrainingModule
  user?: {
    id: string
    full_name?: string
    email?: string
  }
}

interface TeamMember {
  id: string
  full_name: string | null
  email: string
  role: string
}

interface Props {
  modules: TrainingModule[]
  enrollments: EnrollmentWithDetails[]
  teamMembers: TeamMember[]
  stats: {
    totalEnrolled: number
    completedCount: number
    overdueCount: number
    expiringCount: number
    completionRate: number
    teamSize: number
  }
  recommendedModules: RecommendedModule[]
  orgId: string
  userId: string
}

const audienceColors: { [key: string]: string } = {
  'all_employees': 'bg-blue-100 text-blue-700',
  'hiring_managers': 'bg-purple-100 text-purple-700',
  'recruiters': 'bg-orange-100 text-orange-700',
  'talent_acquisition': 'bg-orange-100 text-orange-700',
  'hr_directors': 'bg-green-100 text-green-700',
  'compliance_officers': 'bg-green-100 text-green-700',
  'c_suite': 'bg-red-100 text-red-700',
  'legal': 'bg-red-100 text-red-700',
}

const iconMap: { [key: string]: any } = {
  'Shield': Shield,
  'Users': Users,
  'BookOpen': BookOpen,
  'Mail': Mail,
  'AlertTriangle': AlertTriangle,
  'GraduationCap': GraduationCap,
}

export default function TrainingAdminClient({ 
  modules, 
  enrollments, 
  teamMembers, 
  stats,
  recommendedModules,
  orgId,
  userId 
}: Props) {
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [assigning, setAssigning] = useState(false)
  const [exportingReport, setExportingReport] = useState(false)
  const { gateAction, paywallOpen, dismissPaywall } = usePaywall()

  // Track page view
  useEffect(() => {
    trackEvent('training_admin_view', 'training', 'admin_dashboard')
  }, [])

  // Calculate enrollment and completion rates per module
  const moduleStats = modules.map(module => {
    const moduleEnrollments = enrollments.filter(e => e.module_id === module.id)
    const completed = moduleEnrollments.filter(e => e.status === 'completed').length
    const isRecommended = recommendedModules.some(r => r.id === module.id)
    const recommendation = recommendedModules.find(r => r.id === module.id)
    
    return {
      ...module,
      enrollmentCount: moduleEnrollments.length,
      completionRate: moduleEnrollments.length > 0 
        ? Math.round((completed / moduleEnrollments.length) * 100) 
        : 0,
      isRecommended,
      recommendationReason: recommendation?.reason
    }
  })

  // Group modules by tier
  const tierNames: { [key: number]: string } = {
    1: 'Core Training',
    2: 'State-Specific Compliance',
    3: 'Tool-Specific Training',
    4: 'Industry & Size Requirements',
    5: 'Advanced Certification'
  }

  const modulesByTier = moduleStats.reduce((acc, module) => {
    const tier = module.tier || 1
    if (!acc[tier]) {
      acc[tier] = []
    }
    acc[tier].push(module)
    return acc
  }, {} as { [key: number]: typeof moduleStats })

  const handleAssignModule = async () => {
    if (!selectedModule || selectedUsers.length === 0) return
    
    setAssigning(true)
    try {
      const assignments = selectedUsers.map(userId => ({
        userId,
        moduleId: selectedModule
      }))
      
      await bulkAssignModules(assignments, orgId, userId)
      
      // Track module assignment
      const moduleName = modules.find(m => m.id === selectedModule)?.title || 'unknown'
      trackEvent('training_module_assigned', 'training', moduleName, selectedUsers.length)
      
      setAssignModalOpen(false)
      setSelectedModule(null)
      setSelectedUsers([])
      window.location.reload() // Reload to show new enrollments
    } catch (error) {
      console.error('Error assigning module:', error)
    } finally {
      setAssigning(false)
    }
  }

  const handleExportReport = async () => {
    setExportingReport(true)
    try {
      const { report, textReport, error } = await exportComplianceReport(orgId)
      
      if (error || !textReport) {
        console.error('Error exporting report:', error)
        alert('Failed to export report')
        return
      }
      
      // Track report export
      trackEvent('training_report_exported', 'training', 'compliance_audit')
      
      // Download as text file
      const blob = new Blob([textReport], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `training-compliance-report-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting report:', error)
      alert('Failed to export report')
    } finally {
      setExportingReport(false)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Build team compliance matrix
  const teamMatrix = teamMembers.map(member => {
    const memberEnrollments = enrollments.filter(e => e.user_id === member.id)
    const moduleStatuses = modules.map(module => {
      const enrollment = memberEnrollments.find(e => e.module_id === module.id)
      return {
        moduleId: module.id,
        status: enrollment?.status || 'not_assigned',
        expiresAt: enrollment?.expires_at
      }
    })
    return {
      ...member,
      moduleStatuses
    }
  })

  const getStatusIcon = (status: string, expiresAt: string | null | undefined) => {
    if (status === 'completed') {
      // Check if expired
      if (expiresAt && new Date(expiresAt) < new Date()) {
        return <span className="text-red-500 text-xl">🔴</span>
      }
      return <span className="text-green-500 text-xl">✅</span>
    }
    if (status === 'in_progress') return <span className="text-blue-500 text-xl">🔵</span>
    if (status === 'not_assigned') return <span className="text-gray-300 text-xl">⚪</span>
    if (status === 'expired') return <span className="text-red-500 text-xl">🔴</span>
    return <span className="text-gray-300 text-xl">⚪</span>
  }

  // Recent activity feed
  const recentActivity = enrollments
    .filter(e => e.completed_at)
    .sort((a, b) => 
      new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
    )
    .slice(0, 5)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ActionPaywallModal open={paywallOpen} onClose={dismissPaywall} />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
          <p className="text-gray-600 mt-1">Manage team compliance training and certifications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => gateAction(handleExportReport)}
            disabled={exportingReport}
          >
            <FileText className="w-4 h-4 mr-2" />
            {exportingReport ? 'Exporting...' : 'Export Audit Report'}
          </Button>
          <Link href="/portal/training">
            <Button variant="outline">
              <GraduationCap className="w-4 h-4 mr-2" />
              View My Training
            </Button>
          </Link>
        </div>
      </div>

      {/* Recommended Modules Banner */}
      {recommendedModules.length > 0 && (
        <Card className="mb-6 border-blue-300 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Recommended Training Available
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Based on your organization's profile, we recommend the following training modules:
                </p>
                <div className="space-y-2 mb-4">
                  {recommendedModules.slice(0, 3).map(rec => (
                    <div key={rec.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {tierNames[rec.tier] || `Tier ${rec.tier}`}
                      </Badge>
                      <span className="font-medium">{rec.title}</span>
                      <span className="text-gray-600">— {rec.reason}</span>
                    </div>
                  ))}
                  {recommendedModules.length > 3 && (
                    <p className="text-sm text-gray-600">
                      +{recommendedModules.length - 3} more recommended modules
                    </p>
                  )}
                </div>
                <Button size="sm" onClick={() => gateAction(() => {
                  // Select first recommended module
                  if (recommendedModules.length > 0) {
                    setSelectedModule(recommendedModules[0].id)
                    setAssignModalOpen(true)
                  }
                })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Assign Recommended Modules
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Progress value={stats.completionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expiringCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEnrolled} / {stats.teamSize}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Catalog */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Training Modules</CardTitle>
          <CardDescription>Assign courses to team members — organized by compliance tier</CardDescription>
        </CardHeader>
        <CardContent>
          {[1, 2, 3, 4, 5].map(tier => {
            const tiersModules = modulesByTier[tier] || []
            if (tiersModules.length === 0) return null
            
            return (
              <div key={tier} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tierNames[tier] || `Tier ${tier}`}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {tiersModules.length} module{tiersModules.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiersModules.map(module => {
                    const IconComponent = iconMap[module.icon] || GraduationCap
                    return (
                      <Card key={module.id} className={`hover:shadow-md transition-shadow ${
                        module.isRecommended ? 'border-blue-300 bg-blue-50' : ''
                      }`}>
                        <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{module.title}</h3>
                          {module.isRecommended && (
                            <Badge variant="secondary" className="bg-blue-600 text-white text-xs flex-shrink-0">
                              <Zap className="w-3 h-3 mr-0.5" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{module.description}</p>
                        {module.isRecommended && module.recommendationReason && (
                          <p className="text-xs text-blue-700 mt-1">
                            ⚡ {module.recommendationReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {module.audience.slice(0, 2).map(aud => (
                        <Badge 
                          key={aud} 
                          variant="secondary"
                          className={`text-xs ${audienceColors[aud] || 'bg-gray-100 text-gray-700'}`}
                        >
                          {aud.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {module.audience.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          +{module.audience.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration_minutes} min
                      </span>
                      <span>{module.lesson_count} lessons</span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">
                          {module.enrollmentCount} enrolled
                        </span>
                        <span className="text-gray-500">
                          {module.completionRate}% complete
                        </span>
                      </div>
                      <Progress value={module.completionRate} className="h-1.5" />
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => gateAction(() => {
                        setSelectedModule(module.id)
                        setAssignModalOpen(true)
                      })}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                    <Dialog open={assignModalOpen && selectedModule === module.id} onOpenChange={(open) => {
                      setAssignModalOpen(open)
                      if (!open) setSelectedModule(null)
                    }}>
                      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Assign {module.title}</DialogTitle>
                          <DialogDescription>
                            Select team members to assign this training module
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 mt-4">
                          {teamMembers.map(member => {
                            const alreadyEnrolled = enrollments.some(
                              e => e.user_id === member.id && e.module_id === module.id
                            )
                            return (
                              <div 
                                key={member.id} 
                                className={`flex items-center gap-3 p-3 border rounded-lg ${
                                  alreadyEnrolled ? 'bg-gray-50 opacity-50' : 'hover:bg-gray-50'
                                }`}
                              >
                                <Checkbox
                                  id={member.id}
                                  checked={selectedUsers.includes(member.id)}
                                  onCheckedChange={() => toggleUserSelection(member.id)}
                                  disabled={alreadyEnrolled}
                                />
                                <label htmlFor={member.id} className="flex-1 cursor-pointer">
                                  <div className="font-medium text-sm">
                                    {member.full_name || member.email}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {member.role}
                                    {alreadyEnrolled && ' • Already enrolled'}
                                  </div>
                                </label>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setAssignModalOpen(false)
                              setSelectedModule(null)
                              setSelectedUsers([])
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleAssignModule}
                            disabled={selectedUsers.length === 0 || assigning}
                            className="flex-1"
                          >
                            {assigning ? 'Assigning...' : `Assign (${selectedUsers.length})`}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
        </CardContent>
      </Card>

      {/* Team Compliance Matrix */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Team Compliance Matrix</CardTitle>
          <CardDescription>Track training status across your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Team Member</TableHead>
                  {modules.map(module => (
                    <TableHead key={module.id} className="text-center min-w-[100px]">
                      <div className="text-xs truncate" title={module.title}>
                        {module.title.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMatrix.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">
                          {member.full_name || member.email}
                        </div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </TableCell>
                    {member.moduleStatuses.map(status => (
                      <TableCell key={status.moduleId} className="text-center">
                        {getStatusIcon(status.status, status.expiresAt)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="text-lg">✅</span> Completed
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">🔵</span> In Progress
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">⚪</span> Not Assigned
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">🔴</span> Overdue/Expired
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest training completions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No completed training yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.user?.full_name || activity.user?.email || 'Someone'}
                      </span>
                      {' '}completed{' '}
                      <span className="font-medium">{activity.module?.title}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.completed_at!).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
