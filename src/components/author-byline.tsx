interface AuthorBylineProps {
  authorName?: string
  authorTitle?: string
  publishDate?: string
  updatedDate?: string
}

export function AuthorByline({
  authorName = 'Devyn Bartell',
  authorTitle = 'Founder & CEO, EmployArmor',
  publishDate,
  updatedDate,
}: AuthorBylineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="flex items-center gap-3 py-4 mb-6 border-b border-gray-200">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
        {authorName
          .split(' ')
          .map((n) => n[0])
          .join('')}
      </div>
      <div className="text-sm">
        <div className="font-medium text-gray-900">{authorName}</div>
        <div className="text-gray-500">{authorTitle}</div>
        {(publishDate || updatedDate) && (
          <div className="text-gray-400 text-xs mt-0.5">
            {publishDate && <span>Published {formatDate(publishDate)}</span>}
            {publishDate && updatedDate && <span> · </span>}
            {updatedDate && <span>Updated {formatDate(updatedDate)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
