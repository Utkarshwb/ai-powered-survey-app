import { FeedbackForm } from '@/components/feedback-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Sparkles, Zap, Palette, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🚀 Improvements Delivered!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thanks to user feedback, we've implemented major improvements to make your survey experience even better.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side - Recent Improvements */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Recent Improvements
                </CardTitle>
                <CardDescription>
                  Here's what we've fixed and enhanced based on user feedback:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Dark Mode Fixes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Eliminated white background flashes and improved contrast ratios
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Performance Optimization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Removed "cheap loops" and enhanced dashboard loading speed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Premium UI Design</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Added sophisticated animations and glassmorphism effects
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Component Stability</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Fixed React Server Component compatibility issues
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Animation System</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Smooth fade-in effects and micro-interactions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Zap className="h-3 w-3 mr-1" />
                      Performance
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      <Palette className="h-3 w-3 mr-1" />
                      Design
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Stability
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Try the Improvements Now:</h3>
                <div className="space-y-2">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      🏠 Visit Enhanced Dashboard
                    </Button>
                  </Link>
                  <Link href="/surveys/new">
                    <Button variant="outline" className="w-full justify-start">
                      ✨ Create New Survey
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Feedback Form */}
          <div>
            <FeedbackForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                💡 Your feedback directly influences our development priorities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
