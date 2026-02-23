import Link from "next/link"
import { redirect } from "next/navigation"
import { Shield, LayoutDashboard, ClipboardCheck, FileText, GraduationCap, UserCheck, Settings, Globe, Trash2, FolderCheck, MapPin, Layers, CheckSquare, Users, BookOpen, Home, Wrench, Scale, BarChart3, UserCheck2, Fingerprint, Lock, Accessibility, DollarSign, type LucideIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { SidebarComplianceScore } from "@/components/layout/sidebar-compliance-score"
import { StateProvider } from "@/lib/state-context"
import { getEmployeeProfile, ensureOwnerProfile, isAdmin, type UserRole } from "@/lib/auth/roles"
import { getSidebarCompliance, type SectionStatus } from "@/lib/actions/sidebar-compliance"
import { sectionApplies } from "@/data/compliance-sections"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get organization info including state-as-product fields
  const { data: org } = await supabase
    .from('organizations')
    .select('name, primary_state, active_states')
    .eq('id', user.id)
    .single()

  const orgName = org?.name || 'Your Company'
  const userEmail = user.email || ''
  const primaryState = org?.primary_state || 'IL'
  const activeStates = org?.active_states || ['IL']
  // Get or create employee profile
  let profile = null
  let userRole: UserRole | null = null
  
  // If user owns an organization, auto-create owner profile
  if (org) {
    profile = await ensureOwnerProfile(user.id, user.id, userEmail)
    userRole = profile?.role || null
  } else {
    // User is an employee, not org owner - find their profile
    const { data: employeeProfiles } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (employeeProfiles && employeeProfiles.length > 0) {
      profile = employeeProfiles[0]
      userRole = profile.role as UserRole
    }
  }

  // Get compliance data for sidebar (admin only)
  const complianceData = (userRole && isAdmin(userRole)) ? await getSidebarCompliance() : null
  const sectionStatus = complianceData?.sections || {}

  // Nav items based on role
  // Icon names are passed as strings to avoid server/client serialization issues
  // Grouped nav structure for admin sidebar
  const adminNavSections = [
    {
      label: null, // No header for top section
      items: [
        { href: '/dashboard', icon: LayoutDashboard, iconName: 'LayoutDashboard', label: 'Dashboard' },
        { href: '/employees', icon: Users, iconName: 'Users', label: 'Team' },
        { href: '/tools', icon: Layers, iconName: 'Layers', label: 'Tool Registry' },
        { href: '/approvals', icon: CheckSquare, iconName: 'SquareCheckBig', label: 'Approvals' },
      ],
    },
    {
      label: 'Compliance',
      items: [
        { href: '/candidate-notices', icon: FileText, iconName: 'FileText', label: 'Candidate Notices' },
        { href: '/employee-disclosures', icon: FileText, iconName: 'FileText', label: 'Employee Disclosures' },
        { href: '/bias-audit', icon: Scale, iconName: 'Scale', label: 'Bias Audit' },
        { href: '/impact-assessment', icon: BarChart3, iconName: 'BarChart3', label: 'Impact Assessment' },
        { href: '/consent', icon: UserCheck2, iconName: 'UserCheck2', label: 'Consent & Opt-Out' },
        { href: '/fcra', icon: ClipboardCheck, iconName: 'ClipboardCheck', label: 'FCRA' },
        { href: '/biometric', icon: Fingerprint, iconName: 'Fingerprint', label: 'Biometric Data' },
        { href: '/data-privacy', icon: Lock, iconName: 'Lock', label: 'Data Privacy' },
        { href: '/ada', icon: Accessibility, iconName: 'Accessibility', label: 'ADA Accommodations' },
        { href: '/pay-transparency', icon: DollarSign, iconName: 'DollarSign', label: 'Pay Transparency' },
      ],
    },
    {
      label: 'Policies & Training',
      items: [
        { href: '/handbook', icon: BookOpen, iconName: 'BookOpen', label: 'Handbook Policy' },
        { href: '/training', icon: GraduationCap, iconName: 'GraduationCap', label: 'Training' },
      ],
    },
    {
      label: 'Reports',
      items: [
        { href: '/audit', icon: ClipboardCheck, iconName: 'ClipboardCheck', label: 'Risk Assessment' },
        { href: '/compliance-packet', icon: FolderCheck, iconName: 'FolderCheck', label: 'Audit Packet' },
      ],
    },
  ]
  // Flat list for compatibility
  const adminNavItems = adminNavSections.flatMap(s => s.items)
  const employeeNavItems = [
    { href: '/portal', icon: Home, iconName: 'Home', label: 'My Dashboard' },
    { href: '/portal/disclosures', icon: FileText, iconName: 'FileText', label: 'My Disclosures' },
    { href: '/portal/training', icon: GraduationCap, iconName: 'GraduationCap', label: 'My Training' },
    { href: '/portal/tools', icon: Wrench, iconName: 'Wrench', label: 'Tool Requests' },
  ]
  const navItems = userRole && isAdmin(userRole) ? adminNavItems : employeeNavItems
  // String-only version for client component (MobileSidebar)
  const mobileNavItems = navItems.map(({ href, iconName, label }) => ({ 
    href, icon: iconName, label, 
    hasAction: sectionStatus[href]?.hasAction || false,
    applies: sectionApplies(href, activeStates),
  }))

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar (hamburger menu) */}
      <MobileSidebar orgName={orgName} userEmail={userEmail} navItems={mobileNavItems} complianceScore={complianceData?.score ?? null} />

      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-56 bg-gray-900 text-white flex-col fixed inset-y-0 left-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">EmployArmor</span>
          </Link>
        </div>
        
        {/* Compliance Score */}
        {complianceData && (
          <div className="px-3 py-3 border-b border-gray-800">
            <SidebarComplianceScore initialScore={complianceData.score} />
          </div>
        )}
        
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-4">
            {(userRole && isAdmin(userRole) ? adminNavSections : [{ label: null, items: employeeNavItems }]).map((section, si) => (
              <div key={si}>
                {section.label && (
                  <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {section.label}
                  </div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const status = sectionStatus[item.href] as SectionStatus | undefined
                    const applies = sectionApplies(item.href, activeStates)
                    return (
                      <Link 
                        key={item.href}
                        href={item.href} 
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                          applies 
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-800/50 hover:text-gray-400'
                        }`}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {applies && status?.hasAction && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title={status.label} />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-800 space-y-1">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <div className="space-y-0.5 ml-1">
              {[
                { href: '/settings', label: 'Organization' },
                { href: '/settings/team', label: 'Team' },
                { href: '/settings/disclosure', label: 'Disclosures' },
                { href: '/settings/integrations', label: 'Integrations' },
                { href: '/settings/training', label: 'Training' },
                { href: '/settings/adverse-decisions', label: 'Adverse Decisions' },
                { href: '/settings/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block pl-10 py-1 text-xs text-gray-500 hover:text-gray-300 transition-colors rounded"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {userEmail === 'bartelldevyn@gmail.com' && (
              <Link 
                href="/settings/delete-account" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
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
      
      {/* Main content - offset for desktop sidebar */}
      <main className="flex-1 bg-gray-50 md:ml-56">
        <StateProvider initialState={primaryState} initialAvailableStates={activeStates}>
          {children}
        </StateProvider>
      </main>
    </div>
  )
}
