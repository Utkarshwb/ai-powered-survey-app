import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Brain, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { generatePersonalizedThankYou } from "@/lib/gemini"
import { redirect } from "next/navigation"

interface ThankYouPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sessionId?: string }>
}

export default async function ThankYouPage({ params, searchParams }: ThankYouPageProps) {
  const { id } = await params
  const { sessionId } = await searchParams
  
  let personalizedMessage = null
  
  if (sessionId) {
    try {
      const supabase = await createClient()
      
      // Get survey info
      const { data: survey } = await supabase
        .from("surveys")
        .select("title, description")
        .eq("id", id)
        .single()
      
      // Get questions for this survey
      const { data: questions } = await supabase
        .from("questions")
        .select("*")
        .eq("survey_id", id)
        .order("order_index")
      
      // Get responses for this session
      const { data: responses } = await supabase
        .from("responses")
        .select("*")
        .eq("session_id", sessionId)
      
      if (survey && questions && responses) {
        // Convert responses to key-value pairs
        const responseMap: Record<string, any> = {}
        responses.forEach(response => {
          responseMap[response.question_id] = response.answer_text || response.answer_number || response.answer_boolean
        })
        
        // Try to find user name from responses
        let userName = undefined
        for (const question of questions) {
          const response = responseMap[question.id]
          if (response && typeof response === 'string' && 
              response.length > 0 && response.length < 100 &&
              !response.includes('@')) {
            userName = response.trim()
            break
          }
        }
        
        // Generate personalized thank you message
        const result = await generatePersonalizedThankYou(
          survey.title,
          questions,
          responseMap,
          userName
        )
        
        if (result.success) {
          personalizedMessage = result.message
        }
      }
    } catch (error) {
      console.error("Error generating personalized thank you:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-6">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">FormWise</span>
            </Link>
          </div>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              {personalizedMessage ? (
                <>
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    {personalizedMessage.subject}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium">
                    {personalizedMessage.greeting}
                  </CardDescription>
                </>
              ) : (
                <>
                  <CardTitle className="text-2xl">🎉 Thank You for Your Participation!</CardTitle>
                  <CardDescription>Your responses help us build better experiences</CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {personalizedMessage ? (
                <>
                  <div className="text-gray-700 leading-relaxed">
                    <p className="mb-3">{personalizedMessage.main_message}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-1">🎯 Your Impact:</p>
                    <p className="text-sm text-blue-700">{personalizedMessage.impact_statement}</p>
                  </div>
                  
                  <div className="text-center text-gray-600">
                    <p className="mb-2">{personalizedMessage.closing}</p>
                    <p className="font-medium text-blue-600">{personalizedMessage.signature}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-700 leading-relaxed">
                    <p className="mb-3">Thank you for taking the time to complete our survey. Your thoughtful responses are incredibly valuable to us.</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">🎯 Your Impact:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your responses help us understand user needs better</li>
                      <li>• Your feedback contributes to meaningful improvements</li>
                      <li>• You're part of a community that shapes the future</li>
                    </ul>
                  </div>
                  
                  <div className="text-center text-gray-600">
                    <p className="mb-2">Thank you again for being such a valuable part of our community!</p>
                    <p className="font-medium text-blue-600">Best regards,<br />The FormWise Team 🚀</p>
                  </div>
                </>
              )}
              
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200 text-center">
                  📧 <strong>Check your email!</strong><br />
                  If you provided your email, you'll receive personalized insights based on your responses.
                </p>
              </div>
              
              <div className="pt-4">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create Your Own Survey with FormWise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
