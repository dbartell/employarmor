interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface SoftwareApplicationSchemaProps {
  name?: string
  description?: string
  url?: string
  applicationCategory?: string
  operatingSystem?: string
  offers?: {
    price: string
    priceCurrency?: string
  }
}

export function SoftwareApplicationSchema({
  name = 'EmployArmor',
  description = 'AI hiring compliance platform that automates disclosure generation, bias audit coordination, and multi-jurisdiction regulatory tracking.',
  url,
  applicationCategory = 'BusinessApplication',
  operatingSystem = 'Web',
  offers,
}: SoftwareApplicationSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://employarmor.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: url || baseUrl,
    applicationCategory,
    operatingSystem,
    ...(offers && {
      offers: {
        '@type': 'Offer',
        price: offers.price,
        priceCurrency: offers.priceCurrency || 'USD',
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'EmployArmor',
      url: baseUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface ComparisonSchemaProps {
  title: string
  description: string
  datePublished: string
  products: {
    name: string
    description: string
    url?: string
  }[]
}

export function ComparisonSchema({
  title,
  description,
  datePublished,
  products,
}: ComparisonSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://employarmor.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    datePublished,
    author: {
      '@type': 'Organization',
      name: 'EmployArmor',
      url: baseUrl,
    },
    about: products.map((product) => ({
      '@type': 'SoftwareApplication',
      name: product.name,
      description: product.description,
      ...(product.url && { url: product.url }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
