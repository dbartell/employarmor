"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Shield, 
  Settings, 
  Menu, 
  X,
  Trash2,
  LayoutDashboard,
  Users,
  Layers,
  SquareCheckBig,
  ClipboardCheck,
  FileText,
  BookOpen,
  GraduationCap,
  FolderCheck,
  Home,
  Wrench,
  type LucideIcon
} from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Users, Layers, SquareCheckBig, ClipboardCheck,
  FileText, BookOpen, GraduationCap, FolderCheck, Home, Wrench, Settings,
}

interface NavItem {
  href: string
  label: string
  icon: string
  hasAction?: boolean
}

interface MobileSidebarProps {
  orgName: string
  userEmail: string
  navItems: NavItem[]
  complianceScore?: number | null
}

export function MobileSidebar({ orgName, userEmail, navItems, complianceScore }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">EmployArmor</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile spacer */}
      <div className="md:hidden h-14" />

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Slide-out drawer */}
      <aside 
        className={`
          md:hidden fixed top-0 left-0 bottom-0 w-64 bg-gray-900 text-white z-50 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">EmployArmor</span>
          </Link>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {complianceScore != null && (
          <div className="px-3 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className={`text-2xl font-bold ${complianceScore >= 80 ? 'text-green-400' : complianceScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {complianceScore}
              </div>
              <div>
                <div className="text-xs text-gray-400">Compliance Score</div>
                <div className={`text-sm font-semibold ${complianceScore >= 80 ? 'text-green-400' : complianceScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {complianceScore >= 80 ? 'Strong' : complianceScore >= 50 ? 'Fair' : 'At Risk'}
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon] || FileText
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.hasAction && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 space-y-1">
            <Link
              href="/settings"
              onClick={closeMenu}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                ${pathname.startsWith('/settings')
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            {userEmail === 'bartelldevyn@gmail.com' && (
              <Link
                href="/settings/delete-account"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-red-400 hover:bg-red-900/30 hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
                Delete Account
              </Link>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-3 px-1">
            <div className="text-sm font-medium text-white truncate">{orgName}</div>
            <div className="text-xs text-gray-400 truncate">{userEmail}</div>
          </div>
          <SignOutButton />
        </div>
      </aside>
    </>
  )
}
