"use client"

import { useState, use } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Shield, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToolTrainingSectionView } from "@/components/training/tool-training-section"
import { generateToolModule } from "@/lib/tool-training-data"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ToolTrainingPage({ params }: PageProps) {
  const { slug } = use(params)
  const [sectionComplete, setSectionComplete] = useState(false)

  // TODO: Get org's states from context/API
  const orgStates = ['IL', 'CO', 'NYC']
  
  const module = generateToolModule(slug, orgStates)

  if (!module) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-16">
        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Training Module Not Found</h2>
        <p className="text-gray-500 mb-6">
          We don&apos;t have a training module for this tool yet. One will be generated once the tool is added to your registry.
        </p>
        <Link href="/training">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training
          </Button>
        </Link>
      </div>
    )
  }

  const section = module.sections[0] // Currently single-section per tool

  const handleComplete = async (answers: Record<string, number>) => {
    // TODO: Save to API
    // POST /api/training/tool-progress
    // { toolSlug: slug, sectionNumber: 1, answers }
    setSectionComplete(true)
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/training"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Training
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            {module.category}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {module.estimatedTime}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          {module.toolName} Compliance Training
        </h1>
        <p className="text-gray-500 mt-1">
          Learn what you can and can&apos;t do with {module.toolName} to stay compliant
        </p>
      </div>

      {/* Training Content */}
      <ToolTrainingSectionView
        section={section}
        hostName={module.hostName}
        hostImage={module.hostImage}
        toolName={module.toolName}
        onComplete={handleComplete}
        isComplete={sectionComplete}
      />

      {/* Post-completion: next steps */}
      {sectionComplete && (
        <div className="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">What&apos;s Next?</h3>
          <div className="space-y-2">
            <Link 
              href="/training"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              → View all training modules
            </Link>
            <Link 
              href="/tools"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              → Review your Tool Registry
            </Link>
            <Link 
              href="/disclosures"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              → Check your disclosure page
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
