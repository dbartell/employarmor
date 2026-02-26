'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Shield, ClipboardCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TOUR_STEPS = [
  {
    title: 'Your Compliance Score',
    description: 'This shows your overall compliance status based on the requirements for your states and tools. Complete tasks to improve your score.',
    icon: Shield,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100'
  },
  {
    title: 'Complete Tasks to Get Compliant',
    description: 'We\'ve identified the most important compliance tasks for your organization. Start with "What to do next" items to make the biggest impact.',
    icon: ClipboardCheck,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100'
  },
  {
    title: 'Invite Your Team',
    description: 'Compliance is a team effort. Invite HR team members and managers to collaborate on documents, training, and consent tracking.',
    icon: Users,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100'
  }
]

const STORAGE_KEY = 'employarmor_onboarding_completed'

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Check if tour has been completed
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(STORAGE_KEY)
      if (!completed) {
        // Show tour after a short delay
        setTimeout(() => setIsOpen(true), 1000)
      }
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  if (!isOpen) return null

  const step = TOUR_STEPS[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative px-6 py-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/50 transition-colors text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`w-16 h-16 ${step.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-8 h-8 ${step.iconColor}`} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
          <p className="text-gray-600">{step.description}</p>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 py-4 border-b">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {currentStep + 1} of {TOUR_STEPS.length}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1"
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Skip button */}
        {currentStep < TOUR_STEPS.length - 1 && (
          <div className="px-6 pb-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip tour
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
