import { Breadcrumb } from "@/components/marketing/Breadcrumb"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
          ]}
        />
      </div>
      {children}
    </div>
  )
}
