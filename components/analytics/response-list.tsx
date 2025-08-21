"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, Search, Calendar, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ResponseListProps {
  sessions: any[]
  responses: any[]
  questions: any[]
}

export function ResponseList({ sessions, responses, questions }: ResponseListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSession, setSelectedSession] = useState<any>(null)

  const filteredSessions = sessions.filter((session) => {
    if (!searchTerm) return true

    const sessionResponses = responses.filter((r) => r.session_id === session.id)
    return sessionResponses.some(
      (response) =>
        response.answer_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.answer_number?.toString().includes(searchTerm) ||
        session.respondent_email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  })

  const getSessionResponses = (sessionId: string) => {
    return responses.filter((r) => r.session_id === sessionId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCompletionTime = (session: any) => {
    if (!session.started_at || !session.completed_at) return null

    const start = new Date(session.started_at).getTime()
    const end = new Date(session.completed_at).getTime()
    const duration = end - start

    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getResponseValue = (response: any, question: any) => {
    switch (question.question_type) {
      case "rating":
        return `${response.answer_number}/5 stars`
      case "yes_no":
        return response.answer_boolean ? "Yes" : "No"
      case "number":
        return response.answer_number?.toString() || "No answer"
      default:
        return response.answer_text || "No answer"
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Responses</CardTitle>
          <CardDescription>View and search through individual survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Response List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">{searchTerm ? "No responses match your search." : "No responses yet."}</p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map((session) => {
            const sessionResponses = getSessionResponses(session.id)
            const completionTime = getCompletionTime(session)

            return (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Response #{session.id.slice(-8)}</Badge>
                        {session.respondent_email && <Badge variant="secondary">{session.respondent_email}</Badge>}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(session.completed_at)}
                        </div>
                        {completionTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {completionTime}
                          </div>
                        )}
                        <div>
                          {sessionResponses.length} of {questions.length} questions answered
                        </div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSession(session)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Response Details</DialogTitle>
                          <DialogDescription>
                            Submitted on {formatDate(session.completed_at)}
                            {completionTime && ` • Completed in ${completionTime}`}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {questions.map((question) => {
                            const response = sessionResponses.find((r) => r.question_id === question.id)

                            return (
                              <div key={question.id} className="border-b pb-4">
                                <div className="font-medium mb-2">
                                  Q{question.order_index + 1}: {question.question_text}
                                </div>
                                <div className="text-gray-700 bg-gray-50 p-3 rounded">
                                  {response ? (
                                    getResponseValue(response, question)
                                  ) : (
                                    <span className="text-gray-400 italic">No response</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
