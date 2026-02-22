import { Card } from "@/components/ui/card"
import { GraduationCap, Clock } from "lucide-react"

export default function PortalTrainingPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Training</h1>
        </div>
        <p className="text-gray-600">Complete assigned compliance training modules</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            The training platform is currently under development. Soon you'll be able to:
          </p>
          
          <div className="text-left max-w-md mx-auto space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">Complete interactive training modules on AI compliance</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">Watch video content and pass knowledge checks</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">Earn certificates of completion</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">Track progress and due dates</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-700">Receive reminders for upcoming deadlines</p>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Phase 2 Feature</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
