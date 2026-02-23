"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileText,
  ArrowLeft,
  Loader2
} from "lucide-react"
import Link from "next/link"
import type { Course } from "@/lib/actions/training"
import type { TrainingAssignment } from "@/lib/actions/portal-training"
import { updateTrainingStatus, getQuizQuestions, submitQuiz } from "@/lib/actions/portal-training"

interface CourseClientProps {
  course: Course
  assignment: TrainingAssignment | null
}

export default function CourseClient({ course, assignment: initialAssignment }: CourseClientProps) {
  const router = useRouter()
  const [assignment, setAssignment] = useState(initialAssignment)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set())
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentModule = course.content[currentModuleIndex]
  const isLastModule = currentModuleIndex === course.content.length - 1
  const allModulesCompleted = completedModules.size === course.content.length

  const handleStartCourse = async () => {
    if (!assignment || assignment.status === 'assigned') {
      setIsSubmitting(true)
      await updateTrainingStatus(assignment!.id, 'in_progress')
      setAssignment({ ...assignment!, status: 'in_progress' })
      setIsSubmitting(false)
    }
  }

  const handleModuleComplete = () => {
    const newCompleted = new Set(completedModules)
    newCompleted.add(currentModuleIndex)
    setCompletedModules(newCompleted)

    if (!isLastModule) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    }
  }

  const handleQuizSubmit = async () => {
    if (!assignment) return

    setIsSubmitting(true)
    const result = await submitQuiz(assignment.id, course.id, quizAnswers)
    
    if (!result.error) {
      setQuizResult(result)
      setQuizSubmitted(true)
      
      if (result.passed) {
        const newCompleted = new Set(completedModules)
        newCompleted.add(currentModuleIndex)
        setCompletedModules(newCompleted)
        setAssignment({ ...assignment, status: 'completed', score: result.score })
      }
    }
    
    setIsSubmitting(false)
  }

  const quizQuestions = currentModule?.type === 'quiz' ? getQuizQuestions(course.id) : []

  const progressPercentage = Math.round((completedModules.size / course.content.length) * 100)

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link 
        href="/portal/training"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </Link>

      {/* Course Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              {assignment?.status === 'completed' && (
                <Badge variant="success">Completed</Badge>
              )}
              {assignment?.status === 'in_progress' && (
                <Badge variant="pending">In Progress</Badge>
              )}
            </div>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.modules} modules
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{progressPercentage}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Start Course Button */}
      {assignment && assignment.status === 'assigned' && (
        <Card className="p-8 text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Begin?</h2>
          <p className="text-gray-600 mb-6">
            Click below to start your training. Your progress will be saved automatically.
          </p>
          <Button
            onClick={handleStartCourse}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Training"
            )}
          </Button>
        </Card>
      )}

      {/* Module Navigation */}
      {assignment && assignment.status !== 'assigned' && (
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar - Module List */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Modules</h3>
              <div className="space-y-2">
                {course.content.map((module, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentModuleIndex(index)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      currentModuleIndex === index
                        ? 'bg-blue-50 border-2 border-blue-600 text-blue-900'
                        : completedModules.has(index)
                        ? 'bg-green-50 border border-green-200 text-green-900'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {completedModules.has(index) && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                      {module.type === 'quiz' && !completedModules.has(index) && (
                        <FileText className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="flex-1 line-clamp-2">{module.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{currentModule.title}</h2>
                  {completedModules.has(currentModuleIndex) && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {currentModule.duration}
                </div>
              </div>

              {/* Text Content */}
              {currentModule.type === 'text' && (
                <div>
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {currentModule.content}
                    </p>
                  </div>
                  
                  {!completedModules.has(currentModuleIndex) && (
                    <Button
                      onClick={handleModuleComplete}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Mark as Complete
                    </Button>
                  )}
                  
                  {completedModules.has(currentModuleIndex) && !isLastModule && (
                    <Button
                      onClick={() => setCurrentModuleIndex(currentModuleIndex + 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next Module
                    </Button>
                  )}
                </div>
              )}

              {/* Quiz Content */}
              {currentModule.type === 'quiz' && (
                <div>
                  {!quizSubmitted ? (
                    <>
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          Answer all questions below. You need 70% or higher to pass.
                        </p>
                      </div>

                      <div className="space-y-6 mb-6">
                        {quizQuestions.map((q, qIndex) => (
                          <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">
                              {qIndex + 1}. {q.question}
                            </h4>
                            <div className="space-y-2">
                              {q.options.map((option, oIndex) => (
                                <label
                                  key={oIndex}
                                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                                >
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    value={oIndex}
                                    checked={quizAnswers[qIndex] === oIndex}
                                    onChange={() => {
                                      const newAnswers = [...quizAnswers]
                                      newAnswers[qIndex] = oIndex
                                      setQuizAnswers(newAnswers)
                                    }}
                                    className="mt-1"
                                  />
                                  <span className="text-gray-700">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleQuizSubmit}
                        disabled={quizAnswers.length < quizQuestions.length || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Quiz"
                        )}
                      </Button>
                    </>
                  ) : (
                    <div>
                      {quizResult && quizResult.passed ? (
                        <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Congratulations!
                          </h3>
                          <p className="text-gray-700 mb-4">
                            You passed with a score of {quizResult.score}%
                          </p>
                          {allModulesCompleted && (
                            <Link href="/portal/training">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Return to Training
                              </Button>
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Not Quite There
                          </h3>
                          <p className="text-gray-700 mb-4">
                            You scored {quizResult?.score}%. You need 70% to pass.
                          </p>
                          <Button
                            onClick={() => {
                              setQuizSubmitted(false)
                              setQuizAnswers([])
                              setQuizResult(null)
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Completion Certificate */}
      {assignment?.status === 'completed' && (
        <Card className="p-8 text-center mt-6 border-green-200 bg-green-50">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Training Complete!</h2>
          <p className="text-gray-700 mb-1">
            You completed this training on {assignment.completed_at && new Date(assignment.completed_at).toLocaleDateString()}
          </p>
          {assignment.score && (
            <p className="text-gray-700 mb-6">Final Score: {assignment.score}%</p>
          )}
          <Link href="/portal/training">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Training
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
