import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Brain } from "lucide-react"
import Link from "next/link"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-6">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FormWise</span>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Thank You!</CardTitle>
              <CardDescription>Your response has been successfully submitted.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                We appreciate you taking the time to complete this survey. Your feedback is valuable to us.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📧 <strong>Did you provide your email?</strong><br />
                  If so, check your inbox for personalized insights and analysis based on your responses!
                </p>
              </div>
              <Link href="/">
                <Button className="w-full">Create Your Own Survey</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
