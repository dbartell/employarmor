"use client"

import { useState } from "react"
import { 
  CheckCircle, AlertTriangle, XCircle, Shield, ArrowRight, 
  MapPin, ChevronDown, ChevronUp 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ComplianceHost, HostFeedback } from "./compliance-host"
import type { ToolTrainingSection, ToolQuizQuestion } from "@/lib/tool-training-data"

interface ToolTrainingSectionViewProps {
  section: ToolTrainingSection
  hostName: string
  hostImage?: string
  toolName: string
  onComplete: (answers: Record<string, number>) => void
  isComplete?: boolean
}

export function ToolTrainingSectionView({ 
  section, 
  hostName, 
  hostImage,
  toolName,
  onComplete,
  isComplete = false,
}: ToolTrainingSectionViewProps) {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'results'>(isComplete ? 'results' : 'learn')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showStateNotes, setShowStateNotes] = useState(true)

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return
    setSelectedAnswer(answerIndex)
    setShowFeedback(true)
    setAnswers(prev => ({ 
      ...prev, 
      [section.quiz[currentQuestion].id]: answerIndex 
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < section.quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setPhase('results')
      onComplete(answers)
    }
  }

  const correctCount = Object.entries(answers).filter(
    ([qId, ans]) => section.quiz.find(q => q.id === qId)?.correctAnswer === ans
  ).length

  const passRate = section.quiz.length > 0 ? (correctCount / section.quiz.length) * 100 : 0
  const passed = passRate >= 80

  if (phase === 'learn') {
    return (
      <div className="space-y-6">
        {/* Host introduction */}
        <ComplianceHost
          name={hostName}
          imageUrl={hostImage}
          dialogue={section.hostDialogue}
        />

        {/* Do's, Cautions, Don'ts */}
        <div className="grid gap-4">
          {/* Can Do */}
          <Card className="border-green-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-800">✅ You CAN</h3>
              </div>
              <ul className="space-y-2">
                {section.canDo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Be Careful */}
          <Card className="border-yellow-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-yellow-800">⚠️ Be Careful</h3>
              </div>
              <ul className="space-y-2">
                {section.beCareful.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-yellow-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Do NOT */}
          <Card className="border-red-200">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-semibold text-red-800">❌ Do NOT</h3>
              </div>
              <ul className="space-y-2">
                {section.doNot.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* State-Specific Notes */}
        {section.stateSpecific && section.stateSpecific.length > 0 && (
          <Card className="border-blue-200">
            <CardContent className="pt-5">
              <button 
                onClick={() => setShowStateNotes(!showStateNotes)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800">🏛️ State-Specific Requirements</h3>
                </div>
                {showStateNotes ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {showStateNotes && (
                <div className="mt-3 space-y-3">
                  {section.stateSpecific.map((note, i) => (
                    <div key={i} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-blue-900">{note.stateName}</span>
                        <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">{note.law}</span>
                      </div>
                      <p className="text-sm text-blue-800">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Ready for quiz */}
        <div className="text-center py-4">
          <ComplianceHost
            name={hostName}
            imageUrl={hostImage}
            dialogue={`Alright, now let's make sure you've got it! I've got ${section.quiz.length} quick scenarios for you. Don't worry — they're real-world situations you might actually encounter. Ready?`}
            animate={false}
          />
          <Button 
            onClick={() => setPhase('quiz')} 
            size="lg" 
            className="mt-4"
          >
            <Shield className="w-4 h-4 mr-2" />
            Take the Quiz ({section.quiz.length} questions)
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'quiz') {
    const question = section.quiz[currentQuestion]
    const isCorrect = selectedAnswer === question.correctAnswer

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Question {currentQuestion + 1} of {section.quiz.length}</span>
          <span>{toolName} Compliance Quiz</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / section.quiz.length) * 100}%` }}
          />
        </div>

        {/* Scenario */}
        <Card>
          <CardContent className="pt-6">
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">📋 Scenario</p>
              <p className="text-gray-800">{question.scenario}</p>
            </div>

            <h3 className="font-semibold text-gray-900 mb-4">{question.question}</h3>

            <div className="space-y-3">
              {question.options.map((option, i) => {
                let optionStyle = "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                
                if (showFeedback) {
                  if (i === question.correctAnswer) {
                    optionStyle = "border-green-500 bg-green-50"
                  } else if (i === selectedAnswer && i !== question.correctAnswer) {
                    optionStyle = "border-red-500 bg-red-50"
                  } else {
                    optionStyle = "border-gray-200 opacity-50 cursor-default"
                  }
                } else if (selectedAnswer === i) {
                  optionStyle = "border-blue-500 bg-blue-50"
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-all ${optionStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium ${
                        showFeedback && i === question.correctAnswer
                          ? 'bg-green-500 text-white'
                          : showFeedback && i === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {showFeedback && i === question.correctAnswer ? '✓' : 
                         showFeedback && i === selectedAnswer ? '✗' :
                         String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-gray-700 pt-0.5">{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Host feedback */}
        {showFeedback && (
          <div className="space-y-4">
            <HostFeedback
              name={hostName}
              imageUrl={hostImage}
              feedback={question.hostFeedback}
              isCorrect={isCorrect}
            />
            
            {!isCorrect && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Why: </span>{question.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleNextQuestion}>
                {currentQuestion < section.quiz.length - 1 ? (
                  <>Next Question <ArrowRight className="w-4 h-4 ml-2" /></>
                ) : (
                  <>See Results <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Results phase
  return (
    <div className="space-y-6">
      <Card className={passed ? 'border-green-200' : 'border-orange-200'}>
        <CardContent className="pt-6 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {passed ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? 'You passed! 🎉' : 'Almost there!'}
          </h2>
          <p className="text-gray-600 mb-4">
            You got {correctCount} out of {section.quiz.length} correct ({Math.round(passRate)}%)
          </p>
          {!passed && (
            <p className="text-sm text-orange-600 mb-4">
              You need 80% to pass. Review the material and try again.
            </p>
          )}
        </CardContent>
      </Card>

      <ComplianceHost
        name={hostName}
        imageUrl={hostImage}
        dialogue={passed 
          ? `Excellent work! You now know how to use ${toolName} compliantly. Remember — if you're ever unsure about something, just ask compliance. It's always better to check than to guess. Your certificate will be generated automatically. 🎓`
          : `Don't worry — this stuff is important to get right, so let's make sure you've got it. Review the material above and give the quiz another shot. You've got this! 💪`
        }
        animate={false}
      />

      {!passed && (
        <div className="text-center">
          <Button 
            onClick={() => {
              setPhase('learn')
              setCurrentQuestion(0)
              setAnswers({})
              setSelectedAnswer(null)
              setShowFeedback(false)
            }}
            size="lg"
          >
            Review & Retry
          </Button>
        </div>
      )}
    </div>
  )
}
