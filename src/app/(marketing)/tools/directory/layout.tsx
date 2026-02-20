import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Hiring Tool Compliance Directory | EmployArmor",
  description: "Find out if your HR tools trigger AI compliance requirements. Search our database of popular hiring tools and their compliance profiles across all US state regulations.",
  keywords: ["AI hiring tools", "HR compliance", "AEDT", "bias audit", "AI hiring law", "tool directory"],
}

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
