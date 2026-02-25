"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export type AvatarPose = 
  | 'welcome' 
  | 'presenting' 
  | 'clipboard' 
  | 'important' 
  | 'thinking' 
  | 'thumbsup' 
  | 'concerned' 
  | 'certificate'

export type AvatarCharacter = 'sarah' // more characters coming

const POSE_MAP: Record<AvatarPose, string> = {
  welcome: '01_welcome.png',
  presenting: '02_presenting.png',
  clipboard: '03_clipboard.png',
  important: '04_important.png',
  thinking: '05_thinking.png',
  thumbsup: '06_thumbsup.png',
  concerned: '07_concerned.png',
  certificate: '08_certificate.png',
}

interface TrainingAvatarProps {
  character?: AvatarCharacter
  pose: AvatarPose
  dialogue?: string
  name?: string
  side?: 'left' | 'right'
  showBackground?: boolean
  className?: string
}

export function TrainingAvatar({ 
  character = 'sarah',
  pose, 
  dialogue, 
  name = 'Sarah',
  side = 'left',
  showBackground = true,
  className = ''
}: TrainingAvatarProps) {
  const [loaded, setLoaded] = useState(false)
  const imagePath = `/images/training/${character}/${POSE_MAP[pose]}`

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Office background */}
      {showBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
          {/* Subtle office elements */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className={`relative flex items-end ${side === 'right' ? 'flex-row-reverse' : ''} min-h-[280px]`}>
        {/* Avatar */}
        <div className={`relative z-10 flex-shrink-0 ${side === 'left' ? '-ml-4' : '-mr-4'}`}>
          <img
            src={imagePath}
            alt={`${name} - ${pose}`}
            className={`h-[260px] w-auto object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Dialogue bubble */}
        {dialogue && (
          <div className={`relative z-20 flex-1 p-4 ${side === 'left' ? 'ml-2 mr-4' : 'mr-2 ml-4'}`}>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{name.charAt(0)}</span>
                </div>
                <span className="text-sm font-semibold text-blue-800">{name}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{dialogue}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface TrainingAvatarFeedbackProps {
  character?: AvatarCharacter
  name?: string
  isCorrect: boolean
  feedback: string
}

export function TrainingAvatarFeedback({ 
  character = 'sarah', 
  name = 'Sarah',
  isCorrect, 
  feedback 
}: TrainingAvatarFeedbackProps) {
  const pose: AvatarPose = isCorrect ? 'thumbsup' : 'concerned'
  const imagePath = `/images/training/${character}/${POSE_MAP[pose]}`

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300 ${
      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
    }`}>
      <img
        src={imagePath}
        alt={`${name} - ${isCorrect ? 'thumbs up' : 'concerned'}`}
        className="h-20 w-auto object-contain flex-shrink-0"
      />
      <div className="flex-1">
        <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
          {name} says:
        </p>
        <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
          {feedback}
        </p>
      </div>
    </div>
  )
}
