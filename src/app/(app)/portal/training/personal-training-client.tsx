"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, Clock, CheckCircle, Award, BookOpen, 
  PlayCircle, ArrowRight, Download, RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { updateProgress, completeModule } from '@/lib/actions/training-modules'

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
}

interface Enrollment {
  id: string
  user_id: string
  module_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'expired'
  progress: number
  started_at: string | null
  completed_at: string | null
  expires_at: string | null
  module?: TrainingModule
}

interface Props {
  enrollments: Enrollment[]
}

const iconMap: { [key: string]: any } = {
  'Shield': GraduationCap,
  'Users': GraduationCap,
  'BookOpen': BookOpen,
  'Mail': GraduationCap,
  'AlertTriangle': GraduationCap,
  'GraduationCap': GraduationCap,
}

export default function PersonalTrainingClient({ enrollments }: Props) {
  const router = useRouter()
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  const activeEnrollments = enrollments.filter(e => 
    e.status === 'not_started' || e.status === 'in_progress'
  )
  
  const completedEnrollments = enrollments.filter(e => 
    e.status === 'completed' || e.status === 'expired'
  )

  const handleStartContinue = async (enrollment: Enrollment) => {
    if (enrollment.status === 'not_started') {
      await updateProgress(enrollment.id, 1)
    }
    setExpandedModule(enrollment.module_id)
  }

  const handleCompleteLesson = async (enrollmentId: string, lessonIndex: number, totalLessons: number) => {
    const newProgress = Math.round(((lessonIndex + 1) / totalLessons) * 100)
    await updateProgress(enrollmentId, newProgress)
    
    if (lessonIndex + 1 === totalLessons) {
      await completeModule(enrollmentId)
      router.refresh()
    }
  }

  const getDueDateUrgency = (enrollment: Enrollment) => {
    if (!enrollment.expires_at) return 'green'
    
    const daysUntilExpiration = Math.ceil(
      (new Date(enrollment.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    
    if (daysUntilExpiration < 7) return 'red'
    if (daysUntilExpiration < 30) return 'yellow'
    return 'green'
  }

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'red') return 'bg-red-100 text-red-700 border-red-300'
    if (urgency === 'yellow') return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    return 'bg-green-100 text-green-700 border-green-300'
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Training</h1>
        <p className="text-gray-600">
          Complete your compliance training to stay certified
        </p>
      </div>

      {/* My Assignments */}
      {activeEnrollments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Assignments</h2>
          <div className="space-y-4">
            {activeEnrollments.map(enrollment => {
              const module = enrollment.module!
              const IconComponent = iconMap[module.icon] || GraduationCap
              const urgency = getDueDateUrgency(enrollment)
              const progressPercent = enrollment.progress || 0
              const currentLesson = Math.floor((progressPercent / 100) * module.lesson_count)
              const isExpanded = expandedModule === enrollment.module_id

              return (
                <Card 
                  key={enrollment.id} 
                  className="hover:shadow-lg transition-all"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {module.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {module.description}
                            </p>
                          </div>
                          {urgency && (
                            <Badge 
                              variant="outline"
                              className={`text-xs ${getUrgencyColor(urgency)}`}
                            >
                              {urgency === 'red' && '< 7 days'}
                              {urgency === 'yellow' && '< 30 days'}
                              {urgency === 'green' && '> 30 days'}
                            </Badge>
                          )}
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {module.lesson_count} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            For: {module.audience[0]?.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">
                              Lesson {currentLesson} of {module.lesson_count}
                            </span>
                            <span className="text-gray-500">{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-3" />
                        </div>

                        {/* CTA Button */}
                        {!isExpanded && (
                          <Button 
                            size="lg" 
                            className="w-full"
                            onClick={() => handleStartContinue(enrollment)}
                          >
                            {enrollment.status === 'not_started' ? (
                              <>
                                <PlayCircle className="w-5 h-5 mr-2" />
                                Start Training
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Continue Training
                              </>
                            )}
                          </Button>
                        )}

                        {/* Expanded lesson view */}
                        {isExpanded && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                            <h4 className="font-semibold text-gray-900">Course Content</h4>
                            {module.content.map((lesson: any, idx: number) => {
                              const isCompleted = idx < currentLesson
                              const isCurrent = idx === currentLesson
                              
                              return (
                                <div 
                                  key={idx} 
                                  className={`flex items-center gap-3 p-3 rounded-lg ${
                                    isCurrent ? 'bg-blue-100 border border-blue-300' : 
                                    isCompleted ? 'bg-white border border-gray-200' : 
                                    'bg-white border border-gray-200 opacity-50'
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : isCurrent ? (
                                      <span className="text-sm font-bold text-blue-600">{idx + 1}</span>
                                    ) : (
                                      <span className="text-sm text-gray-400">{idx + 1}</span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{lesson.title}</div>
                                    <div className="text-xs text-gray-500">{lesson.duration} min</div>
                                  </div>
                                  {isCurrent && (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleCompleteLesson(enrollment.id, idx, module.content.length)}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Training */}
      {completedEnrollments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Training</h2>
          <div className="space-y-4">
            {completedEnrollments.map(enrollment => {
              const module = enrollment.module!
              const isExpired = enrollment.expires_at && new Date(enrollment.expires_at) < new Date()
              
              return (
                <Card 
                  key={enrollment.id} 
                  className={`${isExpired ? 'border-orange-300 bg-orange-50' : 'border-green-300 bg-green-50'}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isExpired ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {isExpired ? (
                          <RotateCcw className="w-7 h-7 text-orange-600" />
                        ) : (
                          <Award className="w-7 h-7 text-green-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{module.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span>
                            Completed: {new Date(enrollment.completed_at!).toLocaleDateString()}
                          </span>
                          {enrollment.expires_at && (
                            <span>
                              {isExpired ? 'Expired' : 'Expires'}: {new Date(enrollment.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Certificate
                        </Button>
                        {isExpired && (
                          <Button size="sm">
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Retake
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {enrollments.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No training assigned yet
            </h3>
            <p className="text-gray-600">
              Your manager will assign training modules when needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
