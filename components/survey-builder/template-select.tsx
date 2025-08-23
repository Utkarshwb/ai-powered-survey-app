"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Briefcase, Calendar, Globe, Star } from "lucide-react"
import { surveyTemplates, getTemplatesByCategory, type SurveyTemplate } from "@/lib/survey-templates"

interface TemplateSelectProps {
  onSelectTemplate: (template: SurveyTemplate) => void
  onCreateFromScratch: () => void
}

export function TemplateSelect({ onSelectTemplate, onCreateFromScratch }: TemplateSelectProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const templatesByCategory = getTemplatesByCategory()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business': return <Briefcase className="h-5 w-5" />
      case 'HR': return <Users className="h-5 w-5" />
      case 'Product': return <Star className="h-5 w-5" />
      case 'Events': return <Calendar className="h-5 w-5" />
      case 'Digital': return <Globe className="h-5 w-5" />
      default: return <Star className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Business': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'HR': return 'bg-green-50 text-green-700 border-green-200'
      case 'Product': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Events': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'Digital': return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  if (selectedCategory) {
    const templates = templatesByCategory[selectedCategory]
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(selectedCategory)}
            <h2 className="text-2xl font-bold">{selectedCategory} Templates</h2>
          </div>
          <Button variant="outline" onClick={() => setSelectedCategory(null)}>
            Back to Categories
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.estimatedTime}m
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {template.questions.length} questions
                  </div>
                  <div className="space-y-1">
                    {template.questions.slice(0, 3).map((q, idx) => (
                      <div key={idx} className="text-sm text-gray-600 truncate">
                        • {q.question_text}
                      </div>
                    ))}
                    {template.questions.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        +{template.questions.length - 3} more questions
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => onSelectTemplate(template)}
                  >
                    Use This Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Choose a Survey Template</h1>
        <p className="text-muted-foreground">Start with a pre-built template or create from scratch</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(templatesByCategory).map(([category, templates]) => (
          <Card 
            key={category} 
            className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
            onClick={() => setSelectedCategory(category)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                {getCategoryIcon(category)}
                <div>
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <CardDescription>
                    {templates.length} template{templates.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div key={template.id} className="text-sm text-gray-600 truncate">
                    • {template.name}
                  </div>
                ))}
              </div>
              <Badge className={`mt-3 ${getCategoryColor(category)}`}>
                Browse Templates
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Start from Scratch</h3>
                <p className="text-sm text-muted-foreground">Create a custom survey with your own questions</p>
              </div>
              <Button variant="outline" onClick={onCreateFromScratch}>
                Create Custom Survey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
