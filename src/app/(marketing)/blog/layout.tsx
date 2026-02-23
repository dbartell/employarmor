import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
    </div>
  )
}
