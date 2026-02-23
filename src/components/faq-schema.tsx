'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
  className?: string
}

export function FAQSchema({ faqs, className = '' }: FAQSchemaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Generate JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* FAQ UI */}
      <div className={`space-y-4 ${className}`}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-gray-900 pr-4">
                {faq.question}
              </span>
              <span className="flex-shrink-0 text-gray-500">
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </span>
            </button>
            {openIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="px-4 pb-4 text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
