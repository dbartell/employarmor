"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"

interface ComplianceHostProps {
  name: string
  imageUrl?: string
  dialogue: string
  animate?: boolean
}

export function ComplianceHost({ name, imageUrl, dialogue, animate = true }: ComplianceHostProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className={`flex items-start gap-4 p-5 bg-blue-50 border border-blue-200 rounded-xl ${
      animate ? 'animate-in fade-in slide-in-from-bottom-2 duration-500' : ''
    }`}>
      {/* Host avatar */}
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-300 ring-offset-2"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-blue-300 ring-offset-2">
            <span className="text-white text-xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
        <div className="text-center mt-1">
          <span className="text-xs font-medium text-blue-700">{name}</span>
        </div>
      </div>

      {/* Speech bubble */}
      <div className="flex-1 relative">
        <div className="absolute -left-2 top-4 w-3 h-3 bg-blue-50 border-l border-b border-blue-200 rotate-45" />
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <p className="text-gray-700 leading-relaxed">{dialogue}</p>
        </div>
      </div>
    </div>
  )
}

interface HostFeedbackProps {
  name: string
  imageUrl?: string
  feedback: string
  isCorrect: boolean
}

export function HostFeedback({ name, imageUrl, feedback, isCorrect }: HostFeedbackProps) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300 ${
      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
    }`}>
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCorrect ? 'bg-green-600' : 'bg-orange-600'
          }`}>
            <span className="text-white text-sm font-bold">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium mb-1 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
          {name} says:
        </p>
        <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
          {feedback}
        </p>
      </div>
    </div>
  )
}
