import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

const atsPlatforms = [
  { 
    name: "Greenhouse", 
    description: "Full ATS integration with candidate tracking and compliance monitoring" 
  },
  { 
    name: "Lever", 
    description: "Automated data sync for recruiting workflows and AI tool detection" 
  },
  { 
    name: "Workday", 
    description: "Enterprise HCM integration for large-scale compliance management" 
  },
  { 
    name: "BambooHR", 
    description: "HR platform integration with applicant tracking and employee data" 
  },
  { 
    name: "JazzHR", 
    description: "Small to mid-market ATS with AI-powered candidate screening" 
  },
  { 
    name: "iCIMS", 
    description: "Talent cloud platform for recruitment and onboarding compliance" 
  },
  { 
    name: "Jobvite", 
    description: "Social recruiting platform with AI matching capabilities" 
  },
  { 
    name: "SmartRecruiters", 
    description: "Enterprise hiring platform with AI screening and assessment tools" 
  },
  { 
    name: "Ashby", 
    description: "Modern ATS with analytics and AI-driven candidate recommendations" 
  },
  { 
    name: "Breezy HR", 
    description: "End-to-end hiring software with AI resume parsing" 
  },
  { 
    name: "Teamtailor", 
    description: "Employer branding and recruitment marketing platform" 
  },
  { 
    name: "Recruitee", 
    description: "Collaborative hiring platform with AI-powered sourcing" 
  },
  { 
    name: "Pinpoint", 
    description: "Recruitment software for streamlined hiring workflows" 
  },
]

const hrisPlatforms = [
  { 
    name: "Rippling", 
    description: "All-in-one HR, IT, and finance platform" 
  },
  { 
    name: "BambooHR", 
    description: "Comprehensive HR software for small and medium businesses" 
  },
  { 
    name: "Gusto", 
    description: "Payroll, benefits, and HR management platform" 
  },
  { 
    name: "Paylocity", 
    description: "Cloud-based payroll and HCM software" 
  },
  { 
    name: "Paycom", 
    description: "Online payroll and HR technology" 
  },
  { 
    name: "UKG", 
    description: "Workforce management and HR solutions" 
  },
]

export default function IntegrationsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Integrations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              EmployArmor connects to the tools you already use. No manual data entry, no switching between platforms.
            </p>
          </div>
        </div>
      </section>

      {/* ATS Integrations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Applicant Tracking Systems
            </h2>
            <p className="text-lg text-gray-600">
              Connect your ATS to automatically detect AI tools and monitor compliance in real-time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atsPlatforms.map((platform) => (
              <Card key={platform.name}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {platform.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HRIS Integrations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              HR & People Platforms
            </h2>
            <p className="text-lg text-gray-600">
              Sync employee and hiring data from your HR platform for comprehensive compliance coverage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hrisPlatforms.map((platform) => (
              <Card key={platform.name}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {platform.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Tools</h3>
              <p className="text-gray-600">
                One-click OAuth connection to your ATS or HRIS. No API keys, no complicated setup.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Automatic Detection</h3>
              <p className="text-gray-600">
                EmployArmor scans your hiring workflow to identify AI tools and compliance requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Stay Compliant</h3>
              <p className="text-gray-600">
                Real-time monitoring, automated document generation, and proactive alerts keep you protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missing Integration CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't see your tool?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            We're adding new integrations every month. Let us know what you need.
          </p>
          <Link href="/contact">
            <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100">
              Request an Integration
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            See which AI tools you're using and get your free compliance score.
          </p>
          <Link href="/scorecard">
            <Button size="xl" variant="cta">
              Get Your Free Compliance Score
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
