'use client'

import { useEffect, useState } from 'react'

interface Props {
  initialScore: number
}

export function SidebarComplianceScore({ initialScore }: Props) {
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Animate from 0 to score
    const timer = setTimeout(() => setScore(initialScore), 100)
    return () => clearTimeout(timer)
  }, [initialScore])

  const size = 56
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  const bgColor = score >= 80 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'
  const label = score >= 80 ? 'Strong' : score >= 50 ? 'Fair' : 'At Risk'

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{score}</span>
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-400 leading-tight">Compliance</div>
        <div className={`text-sm font-semibold ${bgColor} leading-tight`}>{label}</div>
      </div>
    </div>
  )
}
