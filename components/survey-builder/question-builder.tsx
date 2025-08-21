"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trash2, Plus, GripVertical } from "lucide-react"
import type { Question } from "@/lib/types"
import { QuestionImprover } from "./question-improver"

interface QuestionBuilderProps {
  question: Question
  index: number
  onUpdate: (updatedQuestion: Partial<Question>) => void
  onDelete: () => void
}

export function QuestionBuilder({ question, index, onUpdate, onDelete }: QuestionBuilderProps) {
  const [options, setOptions] = useState<string[]>(question.options || [])

  const handleQuestionTypeChange = (type: Question["question_type"]) => {
    onUpdate({ question_type: type })

    // Reset options for non-multiple choice questions
    if (type !== "multiple_choice") {
      setOptions([])
      onUpdate({ options: undefined })
    } else if (options.length === 0) {
      // Add default options for multiple choice
      const defaultOptions = ["Option 1", "Option 2"]
      setOptions(defaultOptions)
      onUpdate({ options: defaultOptions })
    }
  }

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`]
    setOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...options]
    newOptions[optionIndex] = value
    setOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  const removeOption = (optionIndex: number) => {
    const newOptions = options.filter((_, i) => i !== optionIndex)
    setOptions(newOptions)
    onUpdate({ options: newOptions })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Text */}
        <div>
          <Label>Question</Label>
          <Textarea
            value={question.question_text}
            onChange={(e) => onUpdate({ question_text: e.target.value })}
            placeholder="Enter your question..."
            rows={2}
          />
          <div className="mt-2">
            <QuestionImprover
              questionText={question.question_text}
              onImprovement={(improvedText) => onUpdate({ question_text: improvedText })}
            />
          </div>
        </div>

        {/* Question Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Question Type</Label>
            <Select value={question.question_type} onValueChange={handleQuestionTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="yes_no">Yes/No</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Switch
              id={`required-${question.id}`}
              checked={question.is_required}
              onCheckedChange={(checked) => onUpdate({ is_required: checked })}
            />
            <Label htmlFor={`required-${question.id}`}>Required</Label>
          </div>
        </div>

        {/* Multiple Choice Options */}
        {question.question_type === "multiple_choice" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(optionIndex)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Scale Info */}
        {question.question_type === "rating" && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            This will display as a 1-5 star rating scale
          </div>
        )}
      </CardContent>
    </Card>
  )
}
