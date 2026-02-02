"use client"

// State names lookup
const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington D.C.", NYC: "New York City",
}

// Valid state codes that have SVG files
const validStateCodes = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
])

interface StateOutlineProps {
  stateCode: string
  size?: number
  highlighted?: boolean
  className?: string
  showLabel?: boolean
}

export function StateOutline({
  stateCode,
  size = 24,
  highlighted = false,
  className = "",
  showLabel = false
}: StateOutlineProps) {
  const code = stateCode.toUpperCase()
  const name = stateNames[code] || stateCode

  // NYC uses NY's outline
  const svgCode = code === "NYC" ? "NY" : code

  if (!validStateCodes.has(svgCode)) {
    // Fallback for unknown states
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500">{stateCode}</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="flex-shrink-0 transition-colors duration-200"
        style={{
          width: size,
          height: size,
          backgroundColor: highlighted ? "#3b82f6" : "#9ca3af",
          WebkitMaskImage: `url(/states/${svgCode}.svg)`,
          maskImage: `url(/states/${svgCode}.svg)`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
        aria-label={name}
      />
      {showLabel && (
        <span className="text-sm">{name}</span>
      )}
    </div>
  )
}

// Export state data for other components
export { stateNames }
export function getStateName(code: string): string {
  return stateNames[code.toUpperCase()] || code
}
