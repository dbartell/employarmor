import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Search } from "lucide-react"
import { GLOSSARY_TERMS } from "@/lib/glossary-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Hiring Glossary - Key Terms & Definitions",
  description: "Comprehensive glossary of AI hiring compliance terms including AEDT, bias audit, disparate impact, impact assessment, and more. Understand the language of AI hiring regulations.",
  openGraph: {
    title: "AI Hiring Compliance Glossary",
    description: "Essential terms and definitions for understanding AI hiring laws and regulations.",
  }
}

export default function GlossaryIndexPage() {
  // Group terms by first letter
  const termsByLetter = GLOSSARY_TERMS.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {} as Record<string, typeof GLOSSARY_TERMS[number][]>)
  
  const letters = Object.keys(termsByLetter).sort()

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Educational Resource
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Hiring Compliance Glossary
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Essential terms and definitions for understanding AI hiring laws, bias audits, and compliance requirements.
          </p>
          <Link href="/scorecard">
            <Button size="lg" variant="cta">
              Check Your Compliance <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Jump */}
      <section className="py-6 border-b sticky top-16 bg-white z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map(letter => (
              <a 
                key={letter}
                href={`#letter-${letter}`}
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-purple-100 hover:text-purple-700 font-medium text-sm transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {letters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="mb-12 scroll-mt-32">
              <h2 className="text-3xl font-bold text-purple-700 mb-6 pb-2 border-b-2 border-purple-200">
                {letter}
              </h2>
              <div className="space-y-4">
                {termsByLetter[letter].map(term => (
                  <Link 
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="block bg-white border rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {term.term}
                          <span className="text-gray-500 font-normal text-base ml-2">
                            ({term.fullName})
                          </span>
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {term.definition}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {term.relatedLaws.slice(0, 3).map((law, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {law}
                            </span>
                          ))}
                          {term.relatedLaws.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{term.relatedLaws.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Understanding Is Just the Start</h2>
          <p className="text-xl text-blue-100 mb-8">
            Now that you know the terms, find out what they mean for your business. Get a free compliance assessment.
          </p>
          <Link href="/scorecard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Free Compliance Score <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
