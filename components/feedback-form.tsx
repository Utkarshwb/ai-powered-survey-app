"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FeedbackForm() {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [issues, setIssues] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fixesReceived, setFixesReceived] = useState<string[]>([])
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/send-thank-you-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userName: userName || undefined,
          issuesReported: issues ? issues.split('\n').filter(issue => issue.trim()) : [],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setFixesReceived(data.fixes || [])
        toast({
          title: "✅ Feedback Received!",
          description: "Thank you! We've sent you a personalized email with solutions to your specific issues.",
        })
        
        // Reset form after success
        setTimeout(() => {
          setEmail('')
          setUserName('')
          setIssues('')
          setIsSuccess(false)
          setFixesReceived([])
        }, 5000)
      } else {
        throw new Error(data.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "❌ Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              We've sent you a personalized email with specific solutions to your issues!
            </p>
            {fixesReceived.length > 0 && (
              <div className="text-left bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 text-sm">
                  Issues We're Fixing:
                </h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  {fixesReceived.map((fix, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-green-500">✓</span>
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Feedback & Get Updates
        </CardTitle>
        <CardDescription>
          Report issues and we'll email you about the fixes we've implemented!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Your Name (Optional)</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issues">What issues are you experiencing? (Optional)</Label>
            <Textarea
              id="issues"
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="Examples:&#10;- Internet connection is slow&#10;- Dark mode has white flashes&#10;- Mobile app doesn't work well&#10;- Survey creation is confusing&#10;- Dashboard loads slowly"
              rows={4}
            />
            <p className="text-sm text-gray-500">
              One issue per line. Our AI will generate specific solutions for each problem you mention!
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              🤖 AI-Powered Solutions
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
              Our AI will analyze your specific issues and generate personalized solutions:
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">🌐 Connection Issues</Badge>
              <Badge variant="secondary" className="text-xs">🌙 Dark Mode</Badge>
              <Badge variant="secondary" className="text-xs">📱 Mobile Problems</Badge>
              <Badge variant="secondary" className="text-xs">⚡ Performance</Badge>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
