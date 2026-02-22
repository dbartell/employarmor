"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Shield, ArrowRight, Filter, Zap } from "lucide-react"
import { toolCatalog, categories, type RiskLevel } from "@/data/tool-catalog"

const riskColors: Record<RiskLevel, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
  none: "bg-gray-100 text-gray-600 border-gray-200",
}

export default function ToolDirectoryPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filtered = useMemo(() => {
    return toolCatalog.filter((tool) => {
      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.vendor.toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            Free Compliance Directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            AI Hiring Tool Compliance Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find out if your HR tools trigger compliance requirements. Search our database of popular hiring tools and their AI compliance profiles.
          </p>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools by name or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-9 pr-8 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No tools found matching your search.</p>
            <p className="text-sm mt-1">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/directory/${tool.slug}`}
                className="group bg-white border rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500">{tool.vendor}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${riskColors[tool.riskLevel]}`}
                  >
                    {tool.riskLevel.charAt(0).toUpperCase() + tool.riskLevel.slice(1)}
                  </span>
                </div>
                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mb-3">
                  {tool.category}
                </span>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Zap className="w-3.5 h-3.5" />
                    {tool.aiFeatures.length} AI feature{tool.aiFeatures.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-blue-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Profile <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 mt-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Want to automate compliance for all your tools?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Get a personalized compliance score and action plan for your entire hiring stack in under 5 minutes.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Free Assessment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
