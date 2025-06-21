"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, CheckCircle, XCircle, Award } from "lucide-react"
import VerifySkeleton from "@/components/skeletons/verify-skeleton"

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock verification result
    const isValid = certificateId.toLowerCase().includes("valid")

    setVerificationResult({
      isValid,
      certificate: isValid
        ? {
            id: certificateId,
            studentName: "John Doe",
            program: "Full Stack Development",
            issueDate: "2024-01-15",
            completionDate: "2024-01-10",
            grade: "A+",
          }
        : null,
    })

    setIsVerifying(false)
  }

  return (
    <main className="pt-16 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-16 reveal-up">
          <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk mb-4">
            Verify <span className="gradient-text">Certificate</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a certificate ID to verify its authenticity and view details.
          </p>
        </div>

        <Card className="reveal-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificate Verification
            </CardTitle>
            <CardDescription>Enter the certificate ID found on your Inlighn Tech certificate.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <VerifySkeleton />
            ) : (
              <>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="certificateId">Certificate ID</Label>
                    <Input
                      id="certificateId"
                      placeholder="e.g., IT-2024-VALID-001"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Tip: Try "IT-2024-VALID-001" for a valid certificate demo
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isVerifying || !certificateId}>
                    <Search className="mr-2 h-4 w-4" />
                    {isVerifying ? "Verifying..." : "Verify Certificate"}
                  </Button>
                </form>

                {verificationResult && (
                  <div className="mt-8 p-6 border rounded-lg">
                    {verificationResult.isValid ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">Certificate Verified</span>
                        </div>

                        <div className="grid gap-4">
                          <div>
                            <Label className="text-sm font-medium">Student Name</Label>
                            <p className="text-lg">{verificationResult.certificate.studentName}</p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Program</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{verificationResult.certificate.program}</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Completion Date</Label>
                              <p>{verificationResult.certificate.completionDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Issue Date</Label>
                              <p>{verificationResult.certificate.issueDate}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Grade</Label>
                            <p className="text-lg font-semibold text-green-600">
                              {verificationResult.certificate.grade}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2 text-red-600">
                          <XCircle className="h-5 w-5" />
                          <span className="font-semibold">Certificate Not Found</span>
                        </div>
                        <p className="text-muted-foreground">
                          The certificate ID you entered could not be verified. Please check the ID and try again.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
