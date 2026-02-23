interface ArticleSchemaProps {
  title: string
  description: string
  datePublished: string // ISO 8601 format: YYYY-MM-DD or full datetime
  dateModified?: string // ISO 8601 format: YYYY-MM-DD or full datetime
  authorName?: string
  authorJobTitle?: string
  authorUrl?: string
  imageUrl?: string
  url?: string
  category?: string
  keywords?: string[]
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  authorName = 'Devyn Bartell',
  authorJobTitle = 'Founder',
  authorUrl = 'https://employarmor.com/about',
  imageUrl,
  url,
  category,
  keywords,
}: ArticleSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://employarmor.com'
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: authorJobTitle,
      url: authorUrl,
      worksFor: {
        '@type': 'Organization',
        name: 'EmployArmor',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'EmployArmor',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(url && { url }),
    ...(category && { articleSection: category }),
    ...(keywords && { keywords: keywords.join(', ') }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
