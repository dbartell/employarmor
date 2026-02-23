"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown, Shield } from "lucide-react"

const stateAILaws = [
  { name: "Illinois", href: "/compliance/illinois", law: "HB 3773, BIPA" },
  { name: "Colorado", href: "/compliance/colorado", law: "AI Act" },
  { name: "California", href: "/compliance/california", law: "CCPA ADMT" },
  { name: "New York City", href: "/compliance/nyc", law: "Local Law 144" },
  { name: "Maryland", href: "/compliance/maryland", law: "HB 1202" },
  { name: "Texas", href: "/compliance/state/texas", law: "TRAIGA, CUBI" },
  { name: "Washington", href: "/compliance/state/washington", law: "My Health My Data" },
  { name: "New Jersey", href: "/compliance/state/new-jersey", law: "Proposed S-1943" },
]

const relatedLawCategories = [
  { category: "Biometric Privacy", states: "IL, TX, WA", href: "/compliance" },
  { category: "All-Party Consent (Wiretapping)", states: "CA, FL, IL, PA, MA, MD, WA, CT, NH, NV, DE, MI, MT" },
  { category: "Pay Transparency", states: "CO, CA, NY, WA, MA, IL, CT + more" },
  { category: "Lie Detector Laws", states: "Federal EPPA + 20 states" },
]

const megaMenuResources = [
  { name: "All AI Hiring Tools", href: "/compliance", description: "Browse compliance by tool" },
  { name: "Compliance Checklist", href: "/resources/compliance-checklist-2026", description: "2026 checklist" },
  { name: "Free Compliance Score", href: "/scorecard", description: "2-minute assessment" },
  { name: "FAQ", href: "/resources/faq", description: "Common questions" },
]

const resources = [
  { name: "Blog", href: "/resources", description: "Latest insights on AI hiring compliance" },
  { name: "Guides", href: "/resources/guides", description: "Step-by-step compliance guides" },
  { name: "Templates", href: "/resources/templates", description: "Ready-to-use compliance documents" },
  { name: "Integrations", href: "/integrations", description: "Supported ATS and HRIS platforms" },
  { name: "Glossary", href: "/glossary", description: "Key terms and definitions" },
  { name: "Tool Comparisons", href: "/compare", description: "Compare AI hiring tools" },
  { name: "FAQ", href: "/resources/faq", description: "Common questions answered" },
]

function Dropdown({ 
  label, 
  items, 
  type = "simple" 
}: { 
  label: string
  items: typeof resources
  type?: "simple" | "detailed"
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 py-2">
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[220px]">
            {type === "simple" ? (
              items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                >
                  <span className="text-gray-900">{item.name}</span>
                </Link>
              ))
            ) : (
              items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  <div className="text-gray-900 font-medium">{item.name}</div>
                  {'description' in item && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StateLawsMegaMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="static"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 py-2">
        State Laws
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50">
          <div className="bg-white border-t shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-3 gap-8">
                {/* Left column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    States with AI-Specific Laws
                  </h3>
                  <div className="space-y-1">
                    {stateAILaws.map((state) => (
                      <Link
                        key={state.href}
                        href={state.href}
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 group"
                      >
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium">{state.name}</span>
                        <span className="text-xs text-gray-400">{state.law}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Middle column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    States with Related Laws
                  </h3>
                  <div className="space-y-4">
                    {relatedLawCategories.map((cat) => (
                      <div key={cat.category}>
                        <p className="text-sm font-medium text-gray-900">{cat.category}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cat.states}</p>
                        {cat.href && (
                          <Link href={cat.href} className="text-xs text-blue-600 hover:text-blue-700">
                            Learn more →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Tools & Resources
                  </h3>
                  <div className="space-y-1">
                    {megaMenuResources.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block py-2 px-3 rounded-md hover:bg-gray-50 group"
                      >
                        <div className="text-gray-700 group-hover:text-gray-900 font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900">Not sure where to start?</p>
                    <p className="text-xs text-blue-700 mt-1">Take our free 2-minute assessment.</p>
                    <Link
                      href="/scorecard"
                      className="inline-block mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Get Your Score →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showStates, setShowStates] = useState(false)
  const [showResources, setShowResources] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900 p-2"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full bg-white border-t shadow-lg z-50">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => setShowStates(!showStates)}
              className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
            >
              State Laws
              <ChevronDown className={`w-4 h-4 transition-transform ${showStates ? 'rotate-180' : ''}`} />
            </button>
            {showStates && (
              <div className="pl-4 space-y-1">
                {stateAILaws.map((state) => (
                  <Link key={state.href} href={state.href} className="block py-1.5 text-sm text-gray-600 hover:text-gray-900">
                    {state.name} <span className="text-gray-400">— {state.law}</span>
                  </Link>
                ))}
                <Link href="/compliance" className="block py-1.5 text-sm text-blue-600 font-medium">
                  View All →
                </Link>
              </div>
            )}

            <button
              onClick={() => setShowResources(!showResources)}
              className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
            >
              Resources
              <ChevronDown className={`w-4 h-4 transition-transform ${showResources ? 'rotate-180' : ''}`} />
            </button>
            {showResources && (
              <div className="pl-4 space-y-1">
                {resources.map((item) => (
                  <Link key={item.href} href={item.href} className="block py-1.5 text-sm text-gray-600 hover:text-gray-900">
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <div className="pt-2 border-t space-y-2">
              <Link href="/login" className="block py-2 text-gray-700">Log in</Link>
              <Link href="/scan" className="block py-2 text-blue-600 font-semibold">Free Compliance Score</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 whitespace-nowrap">EmployArmor</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <StateLawsMegaMenu />
              <Dropdown label="Resources" items={resources} type="detailed" />
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/scan">
                <Button variant="cta">Free Compliance Score</Button>
              </Link>
            </div>

            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/scan" className="hover:text-white">Free Assessment</Link></li>
                <li><Link href="/demo" className="hover:text-white">Request Demo</Link></li>
                <li><Link href="/scorecard" className="hover:text-white">Compliance Score</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">State Laws</h3>
              <ul className="space-y-2">
                {stateAILaws.map((state) => (
                  <li key={state.href}>
                    <Link href={state.href} className="hover:text-white">{state.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {resources.map((resource) => (
                  <li key={resource.href}>
                    <Link href={resource.href} className="hover:text-white">{resource.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>© 2026 EmployArmor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
