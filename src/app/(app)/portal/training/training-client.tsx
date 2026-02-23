"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, CheckCircle2, Clock, PlayCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { TrainingAssignment } from "@/lib/actions/portal-training"
import type { Course } from "@/lib/actions/training"

interface EnrichedAssignment extends TrainingAssignment {
  course: Course | null
}

interface TrainingClientProps {
  assignments: EnrichedAssignment[]
}

export default function TrainingClient({ assignments }: TrainingClientProps) {
  const inProgress = assignments.filter(a => a.status === 'in_progress')
  const assigned = assignments.filter(a => a.status === 'assigned')
  const completed = assignments.filter(a => a.status === 'completed')
  const overdue = assignments.filter(a => a.status === 'overdue')

  const activeAssignments = [...overdue, ...inProgress, ...assigned]
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'in_progress':
        return <Badge variant="pending">In Progress</Badge>
      case 'overdue':
        return <Badge variant="denied">Overdue</Badge>
      default:
        return <Badge variant="warning">Not Started</Badge>
    }
  }

  const getActionButton = (assignment: EnrichedAssignment) => {
    const courseId = assignment.training_module_id
    
    if (assignment.status === 'completed') {
      return (
        <Link href={`/portal/training/${courseId}`}>
          <Button variant="outline" size="sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            View Certificate
          </Button>
        </Link>
      )
    }
    
    if (assignment.status === 'in_progress') {
      return (
        <Link href={`/portal/training/${courseId}`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </Link>
      )
    }
    
    return (
      <Link href={`/portal/training/${courseId}`}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          Start Training
        </Button>
      </Link>
    )
  }

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Training</h1>
        </div>
        <p className="text-gray-600">Complete assigned compliance training modules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="text-2xl font-bold text-gray-900">{overdue.length}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="text-2xl font-bold text-gray-900">{inProgress.length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="text-2xl font-bold text-gray-900">{assigned.length}</div>
          <div className="text-sm text-gray-600">Not Started</div>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="text-2xl font-bold text-gray-900">{completed.length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
      </div>

      {/* Active Training */}
      {activeAssignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Active Training ({activeAssignments.length})
          </h2>
          <div className="space-y-4">
            {activeAssignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.due_date)
              const isOverdue = assignment.status === 'overdue' || (daysUntilDue !== null && daysUntilDue < 0)
              
              return (
                <Card 
                  key={assignment.id} 
                  className={`p-6 ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {assignment.training_title || 'Training Module'}
                        </h3>
                        {getStatusBadge(assignment.status)}
                      </div>
                      
                      {assignment.course && (
                        <>
                          <p className="text-sm text-gray-600 mb-3">
                            {assignment.course.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {assignment.course.duration}
                            </span>
                            <span>{assignment.course.modules} modules</span>
                          </div>
                        </>
                      )}

                      {assignment.due_date && (
                        <div className={`text-sm mb-4 flex items-center gap-1 ${
                          isOverdue ? 'text-red-700 font-medium' : 'text-gray-600'
                        }`}>
                          {isOverdue ? (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              Overdue by {Math.abs(daysUntilDue || 0)} days
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              Due in {daysUntilDue} days ({new Date(assignment.due_date).toLocaleDateString()})
                            </>
                          )}
                        </div>
                      )}

                      {getActionButton(assignment)}
                    </div>
                    
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isOverdue ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <GraduationCap className={`w-6 h-6 ${
                        isOverdue ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Training */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Completed Training ({completed.length})
          </h2>
          <div className="space-y-4">
            {completed.map((assignment) => (
              <Card key={assignment.id} className="p-6 border-green-200 bg-green-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {assignment.training_title}
                      </h3>
                      <Badge variant="success">Completed</Badge>
                      {assignment.score && (
                        <Badge variant="outline">Score: {assignment.score}%</Badge>
                      )}
                    </div>
                    
                    {assignment.course && (
                      <p className="text-sm text-gray-600 mb-3">
                        {assignment.course.description}
                      </p>
                    )}

                    {assignment.completed_at && (
                      <p className="text-sm text-gray-600 mb-4">
                        Completed on {new Date(assignment.completed_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}

                    {getActionButton(assignment)}
                  </div>
                  
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Training */}
      {assignments.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Training Assigned</h3>
          <p className="text-gray-600">You don't have any training assignments at this time.</p>
        </Card>
      )}
    </div>
  )
}
