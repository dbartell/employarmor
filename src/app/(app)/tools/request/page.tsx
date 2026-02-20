"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, CheckCircle2, Loader2 } from "lucide-react"
import { toolCatalog, categories, teamRoles } from "@/data/tool-catalog"

export default function ToolRequestPage() {
  const [selectedTool, setSelectedTool] = useState("")
  const [customToolName, setCustomToolName] = useState("")
  const [category, setCategory] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [customFeatures, setCustomFeatures] = useState("")
  const [justification, setJustification] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const isCustomTool = selectedTool === "__other__"
  const catalogTool = toolCatalog.find((t) => t.slug === selectedTool)

  const toggleFeature = (f: string) =>
    setFeatures((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))

  const toggleRole = (r: string) =>
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/tools/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: isCustomTool ? null : selectedTool,
          toolName: isCustomTool ? customToolName : catalogTool?.name,
          category: isCustomTool ? category : catalogTool?.category,
          features: isCustomTool ? customFeatures.split("\n").filter(Boolean) : features,
          justification,
          roles,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit request")
      }
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white border rounded-xl p-8 text-center mt-12">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h1>
          <p className="text-gray-600 mb-6">
            Your request has been submitted for review. You&apos;ll be notified when a decision is made.
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tool Registry
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Tool Registry
      </Link>

      <div className="flex items-center gap-2 mb-8">
        <Plus className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Request New Tool</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tool Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
          <select
            value={selectedTool}
            onChange={(e) => {
              setSelectedTool(e.target.value)
              setFeatures([])
            }}
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a tool...</option>
            {toolCatalog.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name} ({t.category})
              </option>
            ))}
            <option value="__other__">Other (not listed)</option>
          </select>
          {isCustomTool && (
            <input
              type="text"
              placeholder="Enter tool name"
              value={customToolName}
              onChange={(e) => setCustomToolName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Category (custom tools only) */}
        {isCustomTool && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Which features will you use?
          </label>
          {catalogTool ? (
            <div className="space-y-2">
              {catalogTool.aiFeatures.map((f) => (
                <label key={f.name} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={features.includes(f.name)}
                    onChange={() => toggleFeature(f.name)}
                    className="mt-0.5 rounded border-gray-300"
                  />
                  <div>
                    <span className="text-sm text-gray-900">{f.name}</span>
                    <p className="text-xs text-gray-500">{f.description}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              placeholder="Describe the features you plan to use (one per line)"
              value={customFeatures}
              onChange={(e) => setCustomFeatures(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Justification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            required
            rows={4}
            placeholder="Why does your team need this tool? What problem does it solve?"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Who will use this tool?</label>
          <div className="flex flex-wrap gap-2">
            {teamRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  roles.includes(role)
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  )
}
