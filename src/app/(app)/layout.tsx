import Link from "next/link"
import { redirect } from "next/navigation"
import { Shield, LayoutDashboard, ClipboardCheck, FileText, GraduationCap, UserCheck, Settings, Globe, Trash2, FolderCheck, MapPin, Layers, CheckSquare, Users, BookOpen, Home, Wrench } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { StateProvider } from "@/lib/state-context"
import { getStateName } from "@/lib/state-utils"
import { getEmployeeProfile, ensureOwnerProfile, isAdmin, type UserRole } from "@/lib/auth/roles"

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
  const stateName = getStateName(primaryState)

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

  // Nav items based on role
  // Icon names are passed as strings to avoid server/client serialization issues
  const adminNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, iconName: 'LayoutDashboard', label: 'Dashboard' },
    { href: '/employees', icon: Users, iconName: 'Users', label: 'Team' },
    { href: '/tools', icon: Layers, iconName: 'Layers', label: 'Tool Registry' },
    { href: '/approvals', icon: CheckSquare, iconName: 'SquareCheckBig', label: 'Approvals' },
    { href: '/audit', icon: ClipboardCheck, iconName: 'ClipboardCheck', label: 'Risk Assessment' },
    { href: '/candidate-notices', icon: FileText, iconName: 'FileText', label: 'Candidate Notices' },
    { href: '/employee-disclosures', icon: FileText, iconName: 'FileText', label: 'Employee Disclosures' },
    { href: '/handbook', icon: BookOpen, iconName: 'BookOpen', label: 'Handbook Policy' },
    { href: '/training', icon: GraduationCap, iconName: 'GraduationCap', label: 'Training' },
    { href: '/compliance-packet', icon: FolderCheck, iconName: 'FolderCheck', label: 'Audit Packet' },
  ]
  const employeeNavItems = [
    { href: '/portal', icon: Home, iconName: 'Home', label: 'My Dashboard' },
    { href: '/portal/disclosures', icon: FileText, iconName: 'FileText', label: 'My Disclosures' },
    { href: '/portal/training', icon: GraduationCap, iconName: 'GraduationCap', label: 'My Training' },
    { href: '/portal/tools', icon: Wrench, iconName: 'Wrench', label: 'Tool Requests' },
  ]
  const navItems = userRole && isAdmin(userRole) ? adminNavItems : employeeNavItems
  // String-only version for client component (MobileSidebar)
  const mobileNavItems = navItems.map(({ href, iconName, label }) => ({ href, icon: iconName, label }))

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar (hamburger menu) */}
      <MobileSidebar orgName={orgName} userEmail={userEmail} navItems={mobileNavItems} />

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
        
        {/* State Badge - Shows active state for state-as-product */}
        <div className="px-3 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <span className="text-lg">🏛️</span>
            <span className="text-sm font-medium text-blue-300">{stateName}</span>
            <span className="ml-auto text-xs bg-blue-600/50 text-blue-200 px-1.5 py-0.5 rounded">Active</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
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
