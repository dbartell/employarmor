import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react"
import { ArticleSchema } from "@/components/article-schema"

interface ArticleLayoutProps {
  title: string
  description: string
  category: string
  readTime: string
  publishedDate: string
  children: React.ReactNode
}

export function ArticleLayout({
  title,
  description,
  category,
  readTime,
  publishedDate,
  children,
}: ArticleLayoutProps) {
  return (
    <div className="py-16">
      <ArticleSchema
        title={title}
        description={description}
        datePublished={publishedDate}
        authorName="Devyn Bartell"
        category={category}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/resources" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {category}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {publishedDate}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </header>

        {/* Content */}
        <article className="prose prose-lg prose-blue max-w-none mb-12">
          {children}
        </article>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to get compliant?
          </h2>
          <p className="text-blue-100 mb-6">
            Take our free 2-minute assessment to see where you stand.
          </p>
          <Link href="/scorecard">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Get Your Free Score <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
