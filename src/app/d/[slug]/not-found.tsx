import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Disclosure Page Not Found
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          This disclosure page doesn&apos;t exist or hasn&apos;t been published yet.
          If you&apos;re the owner, please check your disclosure page settings.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to HireShield
        </Link>
      </div>
    </div>
  )
}
