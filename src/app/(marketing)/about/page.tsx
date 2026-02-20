import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About EmployArmor | AI Hiring Compliance Platform',
  description:
    'EmployArmor was founded to help companies navigate AI hiring regulations. Learn about our mission, team, and values.',
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built by employers, for employers
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            AI hiring laws are moving fast. We built EmployArmor so you don't
            have to become a compliance expert to stay on the right side of them.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              EmployArmor was founded to help companies navigate the rapidly
              evolving landscape of AI hiring regulations. As states like
              Illinois, Colorado, California, and New York City introduce new
              compliance requirements, employers need a simple, affordable way to
              stay compliant without hiring expensive consultants.
            </p>
            <p>
              We saw too many companies — especially small and mid-size ones —
              either ignoring these laws entirely (risky) or spending tens of
              thousands on legal fees for basic compliance questions. There had
              to be a better way.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Meet the Founder
          </h2>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
              DB
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Devyn Bartell
              </h3>
              <p className="text-blue-600 font-medium mb-3">
                Founder &amp; CEO
              </p>
              <p className="text-gray-600 leading-relaxed">
                Entrepreneur focused on making compliance accessible to every
                company using AI in hiring. Devyn started EmployArmor after
                seeing firsthand how confusing and fragmented AI hiring
                regulations had become — and how underserved small employers were
                in navigating them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <blockquote className="border-l-4 border-blue-600 pl-6 text-xl text-gray-700 italic leading-relaxed">
            &ldquo;We believe every company — from 10 employees to 10,000 —
            deserves access to clear, actionable compliance guidance.
            EmployArmor automates the hard parts so you can focus on hiring great
            people.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Transparency',
                desc: 'We explain the law in plain English. No gatekeeping, no jargon walls.',
              },
              {
                title: 'Accuracy',
                desc: 'Every recommendation is grounded in actual legislation and regulatory guidance.',
              },
              {
                title: 'Accessibility',
                desc: "Compliance shouldn't be a luxury. We price and design for companies of every size.",
              },
              {
                title: 'Automation',
                desc: 'If a compliance task can be automated, it should be. We save you time so you can focus on people.',
              },
            ].map((value) => (
              <div key={value.title}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get compliant?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Find out where you stand in under 5 minutes.
          </p>
          <Link
            href="/assessment"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Start your free compliance assessment
          </Link>
        </div>
      </section>
    </div>
  )
}
