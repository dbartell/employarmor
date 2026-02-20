import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Scale, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { GLOSSARY_TERMS, getTermBySlug, getAllTermSlugs } from "@/lib/glossary-data"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ term: string }>
}

export async function generateStaticParams() {
  return getAllTermSlugs().map(term => ({ term }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: termSlug } = await params
  const term = getTermBySlug(termSlug)
  if (!term) return { title: 'Term Not Found' }
  
  return {
    title: `${term.term} (${term.fullName}) - AI Hiring Glossary`,
    description: `${term.definition.slice(0, 155)}...`,
    openGraph: {
      title: `${term.term}: ${term.fullName}`,
      description: term.definition.slice(0, 200),
    }
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term: termSlug } = await params
  const term = getTermBySlug(termSlug)
  if (!term) notFound()
  
  // Get related terms
  const relatedTermData = term.relatedTerms
    .map(slug => getTermBySlug(slug))
    .filter(Boolean)
  
  // Get other terms for navigation
  const otherTerms = GLOSSARY_TERMS.filter(t => t.slug !== termSlug).slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            AI Hiring Glossary
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {term.term}
          </h1>
          <p className="text-xl text-purple-700 font-medium mb-6">
            {term.fullName}
          </p>
          <p className="text-lg text-gray-600">
            {term.definition}
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <AlertTriangle className="w-5 h-5" />
                Why This Matters for Employers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900">{term.whyItMatters}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Laws */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Scale className="w-6 h-6 text-gray-700" />
            Related Laws & Regulations
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {term.relatedLaws.map((law, i) => (
              <div key={i} className="bg-gray-50 border rounded-lg p-4">
                <div className="font-medium text-gray-900">{law}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {law.includes('NYC') && 'New York City'}
                  {law.includes('Colorado') && 'Colorado'}
                  {law.includes('Illinois') && 'Illinois'}
                  {law.includes('BIPA') && 'Illinois'}
                  {law.includes('AIVI') && 'Illinois'}
                  {law.includes('Maryland') && 'Maryland'}
                  {law.includes('CCPA') && 'California'}
                  {law.includes('EEOC') && 'Federal'}
                  {law.includes('Title VII') && 'Federal'}
                  {law.includes('ADA') && 'Federal'}
                  {law.includes('EU') && 'European Union'}
                  {law.includes('GDPR') && 'European Union'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-700" />
            Examples in Practice
          </h2>
          <div className="space-y-3">
            {term.examples.map((example, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{example}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Terms */}
      {relatedTermData.length > 0 && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Terms</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTermData.map(related => related && (
                <Link 
                  key={related.slug}
                  href={`/glossary/${related.slug}`}
                  className="bg-white border rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="font-bold text-purple-700">{related.term}</div>
                  <div className="text-sm text-gray-600 mt-1">{related.fullName}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How EmployArmor Helps */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">How EmployArmor Helps</h2>
          <p className="text-xl text-blue-100 mb-8">
            Understanding {term.term} is just the first step. EmployArmor helps you implement compliance for all AI hiring regulations.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Compliance Assessment</h3>
              <p className="text-blue-100">
                Find out which laws apply to your AI hiring tools and what you need to do to comply.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Documentation Templates</h3>
              <p className="text-blue-100">
                Get ready-to-use templates for impact assessments, notifications, and audit preparation.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Free Compliance Score <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse More Terms */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Browse More Terms</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {otherTerms.map(t => (
              <Link 
                key={t.slug}
                href={`/glossary/${t.slug}`}
                className="bg-white border rounded-lg p-3 hover:border-purple-300 transition-all text-center"
              >
                <div className="font-bold text-gray-900">{t.term}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/glossary">
              <Button variant="outline">
                View All Terms <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
