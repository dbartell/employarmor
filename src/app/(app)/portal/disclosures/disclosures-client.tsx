"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { signDisclosure, type Disclosure } from "@/lib/actions/portal-disclosures"
import { getDisclosureContent } from "@/lib/constants/disclosures"

interface DisclosuresClientProps {
  disclosures: Disclosure[]
}

export default function DisclosuresClient({ disclosures: initialDisclosures }: DisclosuresClientProps) {
  const [disclosures, setDisclosures] = useState(initialDisclosures)
  const [selectedDisclosure, setSelectedDisclosure] = useState<Disclosure | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [signatureText, setSignatureText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pendingDisclosures = disclosures.filter(d => !d.signed_at)
  const signedDisclosures = disclosures.filter(d => d.signed_at)

  const handleOpenDisclosure = (disclosure: Disclosure) => {
    setSelectedDisclosure(disclosure)
    setAcknowledged(false)
    setSignatureText("")
    setError(null)
  }

  const handleCloseDialog = () => {
    setSelectedDisclosure(null)
    setAcknowledged(false)
    setSignatureText("")
    setError(null)
  }

  const handleSign = async () => {
    if (!selectedDisclosure || !acknowledged || !signatureText.trim()) {
      setError("Please check the acknowledgment box and provide your signature.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Get client IP and user agent
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const { ip } = await ipResponse.json()
      const userAgent = navigator.userAgent

      const result = await signDisclosure(
        selectedDisclosure.id,
        signatureText.trim(),
        ip,
        userAgent
      )

      if (result.error) {
        setError(result.error)
      } else {
        // Update local state
        setDisclosures(disclosures.map(d => 
          d.id === selectedDisclosure.id 
            ? { ...d, signed_at: new Date().toISOString(), signature_text: signatureText.trim() }
            : d
        ))
        handleCloseDialog()
      }
    } catch (err) {
      setError("Failed to sign disclosure. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const disclosureContent = selectedDisclosure 
    ? getDisclosureContent(selectedDisclosure.document_id)
    : ""

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Disclosures</h1>
        </div>
        <p className="text-gray-600">Review and sign required compliance disclosures</p>
      </div>

      {/* Pending Disclosures */}
      {pendingDisclosures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            Pending Signatures ({pendingDisclosures.length})
          </h2>
          <div className="space-y-4">
            {pendingDisclosures.map((disclosure) => (
              <Card key={disclosure.id} className="p-6 border-orange-200 bg-orange-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {disclosure.document_title}
                      </h3>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      This disclosure requires your review and signature to maintain compliance.
                    </p>
                    <Button 
                      onClick={() => handleOpenDisclosure(disclosure)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Review & Sign
                    </Button>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Signed Disclosures */}
      {signedDisclosures.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Completed ({signedDisclosures.length})
          </h2>
          <div className="space-y-4">
            {signedDisclosures.map((disclosure) => (
              <Card key={disclosure.id} className="p-6 border-green-200 bg-green-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {disclosure.document_title}
                      </h3>
                      <Badge variant="success">Signed</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Signed on {new Date(disclosure.signed_at!).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                      <p>Signature: {disclosure.signature_text}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No disclosures */}
      {disclosures.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Disclosures</h3>
          <p className="text-gray-600">You don't have any disclosures assigned at this time.</p>
        </Card>
      )}

      {/* Signing Dialog */}
      <Dialog open={!!selectedDisclosure} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedDisclosure?.document_title}</DialogTitle>
            <DialogDescription>
              Please read the following disclosure carefully before signing.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {/* Disclosure Content */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {disclosureContent}
              </pre>
            </div>

            {/* Acknowledgment Checkbox */}
            <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Checkbox
                id="acknowledge"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(checked === true)}
              />
              <Label
                htmlFor="acknowledge"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                I have read and understand this disclosure. I acknowledge that I have been informed 
                of my rights and the organization's use of the systems described above.
              </Label>
            </div>

            {/* Signature Input */}
            <div className="mb-6">
              <Label htmlFor="signature" className="mb-2 block">
                Digital Signature (Type your full legal name)
              </Label>
              <Input
                id="signature"
                type="text"
                placeholder="Enter your full name"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="font-serif text-lg"
              />
              <p className="text-xs text-gray-500 mt-2">
                By typing your name above, you are providing a legally binding electronic signature.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSign}
                disabled={!acknowledged || !signatureText.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  "Sign Disclosure"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
